# -*- coding: utf-8 -*-
"""
Created on Sat Dec  2 07:33:32 2023

@author: Ingrid Moa Bolstad

The functions AA_sequence, findplddt and plotscores were co-Penned via standard programming aids
"""

import os
import matplotlib.pyplot as plt
from Bio import PDB


#----------------------------Load all files----------------------------------------
abspath = os.path.abspath(__file__)
dirn = os.path.dirname(abspath)
os.chdir(dirn)
# Get the list of all files and directories
path= r"./Data/RFdiffusion_output"
dir_list = os.listdir(path)
LCC_path= r"./Data/6tht_mhet.pdb"

dirs=[] #paths to pdb files will be loaded into this list
fasta_dirs=[]#paths to fasta files will be loaded into this list
namelist=[] #names for all designs
for folder in dir_list:
    newpath=path+'/'+folder+'/outputs/'
    dir_list=os.listdir(newpath)
    name=dir_list[0]
    namelist.append(name)
    fastapath=newpath+name+'/'+'design.fasta'
    newpath=newpath+name+'/'+'best.pdb'
    dirs.append(newpath)
    fasta_dirs.append(fastapath)
    
#clean the names in the namelist
namelist = [name.split('_')[0] for name in namelist]

#------Functions---------------------------
def AA_sequence(pdb_path):
    structure = PDB.PDBParser().get_structure('protein', pdb_path)
    amino_acid_sequence = ""
    for model in structure:
        for chain in model:
            for residue in chain:
                if PDB.is_aa(residue):
                    amino_acid_sequence += PDB.Polypeptide.three_to_one(residue.get_resname())
    return amino_acid_sequence


def findplddt(best_sequence, file_path): #best_sequence is the AA sequence of the protein, file_path the path to the fasta file
    with open(file_path, 'r') as file:
        file_content = file.read()
    rec = file_content.split('>')
    for r in rec[1:]:
        lines = r.split('\n')
        header = lines[0]
        amino_acid_sequence = ''.join(lines[1:])
        if best_sequence in amino_acid_sequence:
            # Extract the plddt value
            plddt_start = header.find('plddt:') + len('plddt:')
            plddt_end = header.find('|', plddt_start)
            plddt_value = float(header[plddt_start:plddt_end].strip())
            #extract rmsd value
            rmsd_start = header.find('rmsd:') + len('rmsd:')
            rmsd_end = header.find('|', rmsd_start)
            rmsd_value = float(header[rmsd_start:rmsd_end].strip())
            return plddt_value, rmsd_value
    return None           

sequences=[] #all amino acid sequences
for d in dirs: 
    sequences.append(AA_sequence(d))
    
plddts=[]
rmsds=[]
for a in range(len(sequences)):
    p=findplddt(sequences[a], fasta_dirs[a])[0]
    if p is not None:
        plddts.append(p*100)
    r=findplddt(sequences[a], fasta_dirs[a])[1]
    if r is not None:
        rmsds.append(r)
        
#Find which proteins have pLDDT>80 and global RMSD<2 Å:
success=[]
for i in range(len(plddts)):
    if plddts[i]>=80 and rmsds[i]<2:
        success.append([namelist[i], plddts[i], rmsds[i]])
    else:
        None
print(success)
        
#sort from high to low pLDDT value
combined_data = list(zip(plddts, namelist))
sorted_data = sorted(combined_data, key=lambda x: x[0], reverse=True)
sorted_plddts, plddt_sorted_namelist = zip(*sorted_data)

#Sort from low to high RMSD value
combined_rmsd = list(zip(rmsds, namelist))
sort = sorted(combined_rmsd, key=lambda x: x[0])
sorted_rmsds, rmsd_sorted_namelist = zip(*sort)




#-----------------Plot values-------------------
category_colors = {'A': '#E5767C', 'B': '#6FCC71', 'C': '#1FC4C2'}
categories_plddt = [name[0] for name in plddt_sorted_namelist]
categories_rmsd = [name[0] for name in rmsd_sorted_namelist]

def plotscores(sorted_namelist, sorted_scores, plddt=False, rmsd=False):
    plt.figure(figsize=(16, 6))
    plt.xlabel('Proteins')
    if plddt:
        categories=[name[0] for name in plddt_sorted_namelist]
        plt.bar(sorted_namelist, sorted_plddts, color=[category_colors[category] for category in categories])
        plt.ylabel('pLDDT')
        legend_labels = [f'{category}' for category in category_colors]
        plt.legend(handles=[plt.Rectangle((0, 0), 1, 1, color=color) for color in category_colors.values()], labels=legend_labels)
        plt.xticks(rotation=45, ha='right')  # Rotate x-axis labels for better visibility
        plt.savefig('./Figures/plddt_plot.png',  dpi=300, bbox_inches='tight')
        plt.show()
    if rmsd:
        [name[0] for name in rmsd_sorted_namelist]
        plt.bar(rmsd_sorted_namelist, sorted_rmsds, color=[category_colors[category] for category in categories_rmsd])
        plt.ylabel('Backbone RMSD [Å]')
        legend_labels = [f'{category}' for category in category_colors]
        plt.legend(handles=[plt.Rectangle((0, 0), 1, 1, color=color) for color in category_colors.values()], labels=legend_labels)
        plt.xticks(rotation=45, ha='right')  # Rotate x-axis labels for better visibility
        plt.savefig('./Figures/rmsd_AF.png',  dpi=300, bbox_inches='tight')
        plt.show()
    

plotscores(plddt_sorted_namelist, sorted_plddts, plddt=True)
plotscores(rmsd_sorted_namelist, sorted_rmsds, rmsd=True)





