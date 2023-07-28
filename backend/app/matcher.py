import pandas as pd
import sqlite3 as sql
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.utils.fixes import loguniform
from sklearn.model_selection import RandomizedSearchCV

class Matcher:

    def __init__(self) -> None:
        df_columns = ['userid'] + ['key_{}'.format(i) for i in range(43)]
        self.df = pd.DataFrame(columns=df_columns)
        self.scaler = StandardScaler()
        self.classifiers = {}
        self.createClassifiers()


    def addDataFromDB(self, database_name='app.db'):
        dbConnection = sql.connect(database_name)
        db = dbConnection.cursor()

        results = db.execute('''
            SELECT sample.user_id, sample.keytimes
            FROM sample
        ''').fetchall()

        for userid, sample in results:
            current_sample = [float(time) for time in sample.strip('[]').split(',')]
            self.addSample(userid, current_sample)
        return 'success: uploaded database'

    
    def createClassifiers(self):
        MLPclf = MLPClassifier(hidden_layer_sizes=(150,100,50), max_iter=300, random_state=1)
        KNNclf = KNeighborsClassifier(n_neighbors=7)
        # Optimizing SVC classifier
        param_grid = {"C": loguniform(1e3, 1e5), "gamma": loguniform(1e-4, 1e-1),}
        SVCclf = RandomizedSearchCV(SVC(kernel="rbf", class_weight="balanced"), param_grid, n_iter=10)
        # Create dictionary of classifiers
        self.classifiers = {'MLPclf':MLPclf, 'SVCclf':SVCclf, 'KNNclf':KNNclf}
        

    def addSample(self, userid, keytimes): # -> create DataFrame of userid, key_0, key_1...
        # Create initial dictionary
        data_dict = {'userid': [userid]}
        for i, key in enumerate(keytimes):
            data_dict['key_{}'.format(i)] = key
        # Create the DataFrame from the dictionary
        df = pd.DataFrame(data_dict)
        # Add data to dataframe
        self.df = pd.concat([self.df, df], ignore_index=True)
        return 'success: data added to database'


    def scaleData(self, dataframe): # -> scale data in dataFrame
        scaled_df = dataframe
        scaled_df.loc[:, scaled_df.columns != 'userid'] = self.scaler.fit_transform(scaled_df.loc[:, scaled_df.columns != 'userid'])
        return scaled_df
    

    def splitData(self, dataframe): # -> create new train/test split of data
        labels = dataframe['userid'].tolist()
        train_set, test_set = train_test_split(dataframe, test_size=0.25, stratify=labels)
        train_x = train_set.loc[:, train_set.columns != 'userid']
        train_y = train_set['userid'].tolist()
        test_x = test_set.loc[:, test_set.columns != 'userid']
        test_y = test_set['userid'].tolist()
        return (train_x, train_y, test_x, test_y)
    

    def trainClassifiers(self): # -> retrain classifiers, scaling, and creating new train/test split and fitting each to it
        if self.df.__len__() < 10: return 'error: not enough data'
        if self.df['userid'].unique().__len__() < 2: return 'error: not enough users'
        scaled_data = self.scaleData(self.df)
        train_x, train_y, test_x, test_y = self.splitData(scaled_data)
        for classifer in self.classifiers:
            self.classifiers[classifer].fit(train_x, train_y)
        return 'success: trained all classifiers'
        

    # def get_performance(self, classifier, test_x, test_y, ...):
    # def get_match(self, classifier, userid, keytimes):


