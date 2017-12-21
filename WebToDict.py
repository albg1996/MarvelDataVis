from bs4 import BeautifulSoup
import urllib
import re
import numpy as np
import json
from collections import OrderedDict


def web_to_dict():
    page = urllib.request.urlopen('http://www.imdb.com/list/ls036115103/').read()
    soup = BeautifulSoup(page)
    # print(type(soup))
    chars_odd_dict = OrderedDict()
    chars_even_dict = OrderedDict()

    characters_ls_even = soup.find_all("div", class_="list_item even")
    characters_ls_odd = soup.find_all("div", class_="list_item odd")

    for character in characters_ls_odd:
        chars_odd_dict[character.b.get_text()] = character.find("div", {"class": "description"}).get_text()
    for character in characters_ls_even:
        chars_even_dict[character.b.get_text()] = character.find("div", {"class": "description"}).get_text()

    for character in chars_odd_dict:
        chars_odd_dict[character] = get_info(chars_odd_dict[character])

    for character in chars_even_dict:
        chars_even_dict[character] = get_info(chars_even_dict[character])

    characters = merge(chars_odd_dict, chars_even_dict)
    # create_json(characters)
    return characters


def get_info(txt):
    txt = re.subn(pattern=r'\xa0', repl='', string=txt)[0]
    txt = re.subn(pattern=r'ninewheels0', repl='', string=txt)[0]
    txt = re.subn(pattern=r' - ', repl='', string=txt)[0]
    txt = re.subn(pattern=r'[“”]', repl='', string=txt)[0]  # “
    txt = re.subn(pattern=r'\d*:?\d*? minutes', repl='', string=txt)[0]

    txt = txt.split('*')
    temp = OrderedDict()
    try:
        temp['actor'] = txt[0].split('played by ')[1]
    except:
        temp['actor'] = txt[0].split('played ')[1]
    for i in range(1, len(txt)):
        movie_and_duration = txt[i].replace(' ', '', 1).replace('>', '').split(' <')
        temp['{0}'.format(movie_and_duration[0].replace('', ''))] = movie_and_duration[1]

    return temp

def merge(dict1,*dicts):
    for dict2 in dicts:
        dict1.update(dict2)
    return dict1

def create_json(dict1):
    with open('characters_1.json', 'w') as file:
        json.dump(dict1, file)

#if __name__ == "__main__":
#    print(web_to_dict())