import pandas as pd
import numpy as np
import re
from collections import OrderedDict
import warnings
warnings.filterwarnings('ignore')

import WebToDict

char_dict = WebToDict.web_to_dict()
char_dict["Col. James 'Rhodey' Rhodes"]['IRON MAN'] = '8:15'
char_dict['Howard Stark']['CAPTAIN AMERICA: CIVIL WAR'] = '1:45'
char_dict['Bruce Banner']['THE INCREDIBLE HULK'] = '51:45'
char_dict['Fandral']['THOR'] = '7'

def convert(str_time):
    str_time = str_time.split(':')
    try:
        min, sec = str_time
        time = int(min) + (int(sec) / 60)
        return time

    except:
        sec = str_time[1]
        time = (int(sec) / 60)
        return time


_ = 0
file = open('time_fixed.csv', 'w')
for char_name in char_dict.keys():
    for movie in char_dict[char_name].keys():
        if movie == 'actor':
            _ +=  1
        else:
            #time = convert(str(char_dict[char_name][movie]))
            try:
                time = int(str(char_dict[char_name][movie]))
                #print(str(char_dict[char_name][movie]))
                #print(min)

            except:
                time = convert(str(char_dict[char_name][movie]))

                #print(str(char_dict[char_name][movie]))
                #print(str(movie) + ' ' + str(char_name) + ' ' + str(char_dict[char_name][movie]))


            print(str(movie) + ' ' + str(char_name) + ' ' + str(time))
            file.write(str(movie) + ',' + str(char_name) + ',' + str(time))
            file.write('\n')

file.close()







#movie_name, character_name, time
#Example: "Iron Man", "Tony Stark", "122"

#IRON MAN Col. James 'Rhodey' Rhodes 8:15currently played by Don Cheadle
#CAPTAIN AMERICA: CIVIL WAR Howard Stark 1:45played by Dominic Cooper
#THE INCREDIBLE HULK Bruce Banner 51:45currently played by Mark Ruffalo
#THOR Fandral 7played by Zachary Levi


