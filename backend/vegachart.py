import re
import statistics
import random
import pandas as pd
import vega_template
"""
convert all columns to string, in order to json_
"""
def outputConvert(df):
    columns = df.columns
    for col in columns:
        df[col] = df[col].astype(str)
    return df


class Test():
    def __init__(self, dataframe):
        self.dataframe = dataframe 
        # self.template = vega_template.dict_template
        self.__convert_dtypes()
        self._uri_column = self._set_uri_column()
#         print('init', self._uri_column)
        self._date_column = self._set_date_column()
        self._numerical_column = self._set_numerical_column()
        self._coordinate_column = self._set_coordinate_column()
        self._img_column = self._set_image_column()
        self._label_column = self._set_label_column()
        # self.__dataVis()

    def __convert_dtypes(self):
        """
        Convert data type each column of dataframe

        Parameters:
            (pandas.Dataframe) dataframe: The table

        Returns:
            (pandas.Dataframe) table: The result table             
        """

        for column in self.dataframe:
            try:
                self.dataframe[column] = self.dataframe[column].astype('string')
            except ValueError:
                pass

        for column in self.dataframe:
            try:
                self.dataframe[column] = self.dataframe[column].astype('datetime64')
            except ValueError:
                pass

        for column in self.dataframe:
            try:
                self.dataframe[column] = self.dataframe[column].astype('float64')
            except (ValueError, TypeError):
                pass

    def _set_numerical_column(self):
            """
            Get date column name of dataframe based on date data type
            """
            numerical_column = [name for name in self.dataframe.columns if self.dataframe[name].dtypes == 'float64']

            return numerical_column 
    def _set_uri_column(self):
            """
            Get date column name of dataframe based on date data type
            """
            #Regex pattern
            """
            Get uri column name of dataframe based on regex pattern

            :return: (list) uri_column: list of uri variable
            """
            #Regex pattern
            pattern_url = r"^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$(?<!.[jpg|gif|png|JPG|PNG])" 
            uri_column = self.set_column_based_on_regex(pattern_url)
            return uri_column
    def _set_image_column(self):
            """
            Get image column name of dataframe based on regex pattern

            :return: (list) image_column: list of image variable
            """
            #Regex pattern
            pattern_img = r"^http(s)?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|jpeg|gif|png|JPG|JPEG|Jpeg)$"        
            image_column = self.set_column_based_on_regex(pattern_img)

            return image_column
    def _set_coordinate_column(self):
            """
            Get coordinate column name of dataframe based on regex pattern

            :return: (list) coordinate_column: list of coordinate variable
            """
            #Regex pattern
            pattern_coordinate1 = r"^Point"
            pattern_coordinate2 = r"^POINT"
            coordinate_column1 = self.set_column_based_on_regex(pattern_coordinate1)
            coordinate_column2 = self.set_column_based_on_regex(pattern_coordinate2)

            coordinate_column = coordinate_column1 + coordinate_column2
            return coordinate_column

    def set_column_based_on_regex(self, pattern):
        """
        Set list of column name based on regex matching

        :return: (list) column: list of name
        """
        list_column = []

        for i in range (len(self.dataframe.columns)):
            column_name = self.dataframe.columns[i]
            column = self.dataframe[self.dataframe.columns[i]]
            is_matched_column = self.check_data_per_column(column, pattern)
            if is_matched_column:
                list_column.append(column_name)
#         print(list_column)
        return list_column

    def check_data_per_column(self, column, pattern):
        """
        Check entire data per column of dataframe if matched with regex pattern

        Parameters:
            (pandas.Dataframe) column: column of dataframe
            (string) pattern: regex pattern

        Returns:
            (boolen) boolean_check: The result table             
        """
        boolean_check = False
        for datapoint in range(len(column)):
            data = column.iloc[datapoint]
            try:
                if re.match(pattern, data):
                    boolean_check = True
            except TypeError:
                pass
                
        return boolean_check
    def _set_date_column(self):
        """
        Get date column name of dataframe based on date data type
        """
        date_column = [name for name in self.dataframe.columns if self.dataframe[name].dtypes == 'datetime64[ns]']

        return date_column
    def _set_label_column(self):
        """
        Get label column name of dataframe based on 'string' dtypes 
            with excluded uri, image url and coordinate column

        :return: (list) label_column: list of label column        
        """
        str_column = list(self.dataframe.columns)
#         print(self._uri_column, self._img_column, self._coordinate_column, self._numerical_column, self._date_column)
        #exclude uri, image url, coordinate column
        excluded_column = self._uri_column + self._img_column + self._coordinate_column + self._numerical_column + self._date_column
        label_column = [i for i in str_column + excluded_column if i not in str_column or i not in excluded_column]

        return label_column
    
    
    
    def vegaGen(self, x_, y_, chartname):
        temp_vega= getTemplate(chartname)
        temp_vega['data']['values'] = outputConvert(self.dataframe.filter(items=[x_, y_])).to_dict('records')
        temp_vega['encoding']['x']['field'] = x_
        temp_vega['encoding']['y']['field'] = y_
        # print(temp_vega['encoding'])
        return temp_vega


def getTemplate(chartname):
    return vega_template.dict_template[chartname]

def vegaGen( x_, y_, chartname, dataframe):
    
    temp_vega= getTemplate(chartname)
    temp_vega['data']['values'] = dataframe.filter(items=[x_, y_]).to_dict('records')
    temp_vega['encoding']['x']['field'] = x_
    temp_vega['encoding']['y']['field'] = y_
    return temp_vega


def dataVis(self, dataframe):
    all_vega = []
    # temporal using line chart 
    # for x_ in self._date_column:
    #     for y_ in self._numerical_column:
    #         options = ['linechart', 'areachart']
    #         random_ = random.randint(0, 1)
    #         temp_ = vegaGen(template, x_, y_, options[random_], dataframe)

    for i in range(len(self._numerical_column)):
        for j in range(i+1, len(self._numerical_column)):
            x_ = self._numerical_column[i]
            y_ = self._numerical_column[j]
            # print(x_, y_)
            temp_ = vegaGen( x_, y_, 'scatterplot', dataframe)
            # print(temp_['encoding'])
            all_vega.append(temp_)
            for ele in all_vega:
                print(ele['encoding'])




    # def vegaGen_pie(self, x_, y_, chartname="piechart"):
    #     temp_vega= self.template[chartname]
    #     temp_vega['data']['values'] = outputConvert(self.dataframe.filter(items=[x_, y_])).to_dict('records')
    #     temp_vega['encoding']['color']['field'] = x_
    #     temp_vega['encoding']['theta']['field'] = y_
        
        # return temp_vega
    # def __dataVis(self):
    #     self.vega = []
    #     ## temporal using line chart 
    #     for x_ in self._date_column:
    #         for y_ in self._numerical_column:
    #             options = ['linechart', 'areachart']
    #             random_ = random.randint(0, 1)
    #             self.vega.append(self.vegaGen(x_, y_, options[random_]))
        
    #     for i in range(len(self._numerical_column)):
    #         for j in range(i+1, len(self._numerical_column)):
            
    #             x_ = self._numerical_column[i]
    #             y_ = self._numerical_column[j]
    #             vega_ = self.vegaGen(x_, y_, 'scatterplot')
    #             # print(vega_['encoding'])
    #             self.vega.append(vega_)
                

    #     for x_ in self._label_column:
    #         for y_ in self._numerical_column:
    #             options = ['barchart']
    #             # random_ = random.randint(0,1)
    #             # if random_ ==0:
    #             #     self.vega.append(self.vegaGen_pie(x_, y_))
    #             # else:
    #             self.vega.append(self.vegaGen(x_, y_, options[0]))
                    
