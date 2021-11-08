import os
import re

def main():

    #get current working directory
    path = os.getcwd() + "/images/";
    
    #ask which image folder to sanitize filenames from
    requestedFolder = (input("Which image folder would you like to rename the files of:\n"))+"/"
    #path+=requestedFolder

    #loop through filenames and images within
    for(file) in os.listdir(path):
        currPath = path;
        currPath = currPath+file+"/"
        sorted_files = sorted_alphanumeric(os.listdir(currPath));
        for (count, filename) in enumerate(sorted_files):
            dst = file+str(count)+os.path.splitext(filename)[1] #rename image based on folder i.e. afraid01, 02, 03 etc
            src = currPath + filename
            dst = currPath + dst
            os.rename(src, dst);


def sorted_alphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ] 
    return sorted(data, key=alphanum_key)

if __name__ == '__main__':
    main()