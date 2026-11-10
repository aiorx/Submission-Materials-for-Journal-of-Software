import customtkinter as ctk
import os
import sys

from PIL import Image
from view.videotypebutton import VideoTypeButton

# Assisted with basic coding tools
# Function to determine if the application is running as a frozen executable
def resource_path(relative_path):
    """ Get the absolute path to the resource, working for both script and PyInstaller executable. """
    if hasattr(sys, '_MEIPASS'):
        # PyInstaller creates a temporary folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    
    return os.path.join(base_path, relative_path)

# Path to app/img folder, adjusted for both script and executable
IMG_FOLDER_PATH = resource_path("img")


class VideoTypeFrame(ctk.CTkFrame):
    
    ## CONSTRUCTOR --------------------------------------------------------------------------------------------------------- ##
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)
        
        # For debug : printing img folder path
        print(f"IMG_FOLDER_PATH: {IMG_FOLDER_PATH}")

        # Setting the master
        self.master = master

        # Grid layout configuration
        self.columnconfigure((0,1), weight=1)
        self.rowconfigure(0, weight=1)
        self.rowconfigure(1, weight=3)

        # Video Type Label
        self.lblVideoType = ctk.CTkLabel(self, text="Video type")
        self.lblVideoType.grid(row=0, column=0, sticky="w", padx=8)

        # Solar Activity Video Button
        self.icnSun = ctk.CTkImage(Image.open(os.path.join(IMG_FOLDER_PATH, "sun.png"))) # Defining icon
        self.btnSolarActivityVideo = VideoTypeButton(self, fg_color=("orange"), text="Solar activity video", image=self.icnSun, compound="top")
        self.btnSolarActivityVideo.configure(command=lambda b=self.btnSolarActivityVideo: self.VideoTypeButtonClicked(b)) # Setting up command with itself as parameter 
        self.btnSolarActivityVideo.grid(row=1, column=0, sticky="e", padx=8, pady=8)

        # Particle Flux Graph Button
        self.icnGraph = ctk.CTkImage(Image.open(os.path.join(IMG_FOLDER_PATH, "graph.png"))) # Defining icon
        self.btnParticleFluxGraph = VideoTypeButton(self, text="Particle flux graph", image=self.icnGraph, compound="top")
        self.btnParticleFluxGraph.configure(command=lambda b=self.btnParticleFluxGraph: self.VideoTypeButtonClicked(b)) # Setting up command with itself as parameter 
        self.btnParticleFluxGraph.grid(row=1, column=1, sticky="w", padx=8, pady=8)

        # Dictionary to define which button is selected
        self._dctSelection = {self.btnParticleFluxGraph : False, self.btnSolarActivityVideo : True}
        self.updateVideoTypeButtons() 
    ## --------------------------------------------------------------------------------------------------------------------- ##


    ## METHODS ------------------------------------------------------------------------------------------------------------- ##

    ## Getter of dctSelection dictionary, where the keys are string
    @property
    def dctSelection(self):
        return {"btnParticleFluxGraph" : self._dctSelection[self.btnParticleFluxGraph], "btnSolarActivityVideo" : self._dctSelection[self.btnSolarActivityVideo]}
    
    ## Setter of dctSelection dictionary
    @dctSelection.setter
    def dctSelection(self, newDctSelection):
        self._dctSelection = newDctSelection


    ## This function, triggered by a VideoTypeButton, sets the boolean value
    ## for button selection on the dctSelection dictionary
    ## The two buttons can be selected, but at least one must be selected
    def VideoTypeButtonClicked(self, buttonClicked):

        # Checking if the button clicked is the only one on True.
        # If so, we skip the deselection
        if self._dctSelection[buttonClicked] == True:
            only_one_selected = True

            # Checking every button that is not the one clicked
            for oneButton in self._dctSelection.keys():
                if oneButton != buttonClicked and self._dctSelection[oneButton] == True:
                    only_one_selected = False
            
            if not only_one_selected:
                self._dctSelection[buttonClicked] = False
        
        # Case when the button was deselected
        else:
            self._dctSelection[buttonClicked] = True

        # We update every button's color
        self.updateVideoTypeButtons()

        # Case when the button clicked is the ParticleFluxGraph Button,
        # We toggle the ParticleFluxOptions Frame
        if buttonClicked == self.btnParticleFluxGraph:
            self.master.toggle_ParticleFluxOptionsFrame(self._dctSelection[buttonClicked])
    

    ## This function updates every VideoTypeButton,
    ## according to dctSelection
    def updateVideoTypeButtons(self):

        # We browse every couple VideoTypeButton/Boolean element in the dictionary
        for key, value in self._dctSelection.items():

            # If the button is selected
            if value == True:
                key.select()                

            # If not
            else:
                key.deselect()