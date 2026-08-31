# For decompressing files
# Designed via basic programming aids
# changed by wei
# Feb 22, 2023


import os
from datetime import datetime
import zipfile
import rarfile
import py7zr

def is_zip(path:str):
    if path.split('.')[-1].lower()=='zip':
        return True
    return False

def is_rar(path:str):
    if path.split('.')[-1].lower()=='rar':
        return True
    return False

def is_7z(path:str):
    if path.split('.')[-1].lower()=='7z':
        return True
    return False

#path = r"F:\Philosophy\cosplay".replace('\\','/')  # 压缩包所在目录的路径
path=r'F:\Philosophy\comic'.replace('\\','/')
start_date = "2024-01-04"
end_date = "2024-01-22"  # 压缩包创建的日期，格式为 "YYYY-MM-DD"
zip_num=0
ex_num=0

# 将日期字符串转换为 datetime 对象
#print(end_date)
for file_name in os.listdir(path):
    flag=0
    file_path = os.path.join(path, file_name).replace('\\','/')
    # 判断文件类型 1: zip, 2: rar, 0: 其他
    if is_zip(file_path):
        flag=1
    elif is_rar(file_path):
        flag=2
    elif is_7z(file_path):
        flag=3
    if flag==0:
        continue
    #print(file_path)
    # 获取文件创建时间并转换为 datetime 对象
    file_date = datetime.strftime(datetime.fromtimestamp(os.path.getmtime(file_path)),"%Y-%m-%d")
    # 只处理创建日期大于起始日期和小于结束日期的压缩包
    if file_date > end_date or file_date<start_date:
        #print(f"{file_name} is not at {end_date}")
        continue
    #print(file_date)
    print(file_name)
    zip_num+=1
    #print(file_path)
    dir_path=''.join(file_path.split('.')[:-1])
    #print(dir_path)
    if os.path.exists(dir_path):
        ex_num+=1
        continue
    os.mkdir(dir_path)  
    # 解压缩包
    if flag==1:
        zip_file=zipfile.ZipFile(file_path)
    elif flag==2:
        zip_file=rarfile.RarFile(file_path)
    if zip_file:
        for name in zip_file.namelist():
            zip_file.extract(name,dir_path)
    if flag==3:
        with py7zr.SevenZipFile(file_path, mode='r',) as z:
            z.extractall(path=dir_path)
    print(f"Successfully extracted {file_path}")
    ex_num+=1
print(f"Zip files: {zip_num}, Extracted Files: {ex_num}")
