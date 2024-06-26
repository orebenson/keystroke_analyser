import pandas as pd
import sqlite3 as sql
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.utils.fixes import loguniform
from sklearn.metrics import accuracy_score
import time

class Matcher:

    def __init__(self, prompt_length) -> None:
        df_columns = ['userid'] + ['key_{}'.format(i) for i in range(prompt_length)]
        self.df = pd.DataFrame(columns=df_columns)
        self.scaler = StandardScaler()
        self.classifiers = {}
        self.accuracies = {}
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
        classifier_init = self.trainClassifiers()
        
        return {'status':'SUCCESS', 'message':f'database uploaded to matcher, {classifier_init["message"]}'}

    
    def createClassifiers(self):
        
        MLPclf = MLPClassifier(hidden_layer_sizes=(100,100,100), max_iter=500, random_state=1)
        KNNclf = KNeighborsClassifier(n_neighbors=11)
        
        param_grid = {"C": loguniform(1e3, 1e5), "gamma": loguniform(1e-4, 1e-1),} # Optimizing SVC classifier
        SVMclf = RandomizedSearchCV(SVC(kernel="rbf", class_weight="balanced"), param_grid, n_iter=10)
        
        self.classifiers = {'MLPclf':MLPclf, 'SVMclf':SVMclf, 'KNNclf':KNNclf}
        

    def addSample(self, userid, keytimes):
        
    
        df = self.formatData(userid, keytimes)
        
        self.df = pd.concat([self.df, df], ignore_index=True)
        
        return {'status':'SUCCESS', 'message':'data submitted to matcher'}
    
    
    def formatData(self, userid, keytimes):

        
        data_dict = {'userid': [userid]}
        for i, key in enumerate(keytimes):
            data_dict['key_{}'.format(i)] = key
            
        df = pd.DataFrame(data_dict)
        
        return df


    def scaleData(self, dataframe): 
       
        scaled_df = dataframe
        scaled_df.loc[:, scaled_df.columns != 'userid'] = self.scaler.fit_transform(scaled_df.loc[:, scaled_df.columns != 'userid'])
       
        return scaled_df
    

    def splitData(self, dataframe):

        # filter out userids with less than 5 occurrences
        userid_counts = dataframe['userid'].value_counts()
        valid_userids = userid_counts[userid_counts >= 2].index.tolist()
        filtered_dataframe = dataframe[dataframe['userid'].isin(valid_userids)]
        labels = filtered_dataframe['userid'].tolist()

        train_set, test_set = train_test_split(filtered_dataframe, test_size=0.25, stratify=labels)
        train_x = train_set.loc[:, train_set.columns != 'userid']
        train_y = train_set['userid'].tolist()
        test_x = test_set.loc[:, test_set.columns != 'userid']
        test_y = test_set['userid'].tolist()

        return (train_x, train_y, test_x, test_y)
    

    def trainClassifiers(self):
        
        if self.df.__len__() < 10: 
            return {'status':'ERROR', 'message':'not enough data for classifiers'}
        if self.df['userid'].unique().__len__() < 2: 
            return {'status':'ERROR', 'message':'not enough users for classifiers'}
        start_time = time.time()

        scaled_data = self.scaleData(self.df)
        
        train_x, train_y, test_x, test_y = self.splitData(scaled_data)
        
        for classifer in self.classifiers:
            self.classifiers[classifer].fit(train_x, train_y)
            self.accuracies[classifer] = self.get_accuracy(self.classifiers[classifer], test_x, test_y)


        end_time = time.time()
        elapsed_time = end_time - start_time

        return {'status':'SUCCESS', 'message':f'trained all classifiers in {elapsed_time} seconds'}

    def get_accuracy(self, clf, test_x, test_y):

        y_pred = clf.predict(test_x)
        acc = accuracy_score(test_y, y_pred)

        return acc

    def getMatch(self, userid, keytimes, keytype):
        
        if self.df.__len__() < 10: 
            return {'status':'ERROR', 'message':'not enough data'}
        
        formatted_data = self.formatData(userid, keytimes)
        scaled_data = self.scaleData(formatted_data)
        input_x = scaled_data.loc[:, scaled_data.columns != 'userid']
        prediction = self.classifiers[keytype].predict(input_x)[0]
        accuracy = round(self.accuracies[keytype], 4)*100
        if prediction != userid:
            return {'status':'REJECTED', 'message':f'unauthorized with {accuracy}% accuracy'}
        else:
            return {'status':'ACCEPTED', 'message':f'authorized with {accuracy}% accuracy'}


