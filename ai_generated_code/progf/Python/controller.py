# -*- coding: utf-8 -*-
"""
Created on Mon May  2 09:51:28 2022

Optimized Supported by standard GitHub tools
"""

from PyQt5.QtCore import pyqtSignal, QThread


class Controller:
    """
    Controller class to manage the interaction between the view and the model.
    """

    # Signals to communicate between objects
    eeg_data = pyqtSignal(object)
    spectra_data = pyqtSignal(object)
    asym_data = pyqtSignal(object)
    lpe_data = pyqtSignal(object)
    light_data = pyqtSignal(object)
    bar_data = pyqtSignal(object)

    def __init__(self, view, model):
        """
        Initialize the Controller with the given view and model.

        Parameters
        ----------
        view : class
            View class.
        model : class
            Model class.
        """
        self.__model = model
        self.__view = view

        # Create a QThread object
        self.thread = QThread()

        # Create a worker object
        self.worker = self.__model

        # Move worker to the thread
        # You can use worker objects by moving them to the thread
        self.worker.moveToThread(self.thread)

        # When the Start signal is emitted, begins execution of the thread
        # by calling run()
        self.thread.started.connect(self.worker.run)

        # Tells the thread's event loop to exit
        self.worker.finished.connect(self.thread.quit)

        # To delete the worker and the thread objects when the work is done
        self.worker.finished.connect(self.worker.deleteLater)
        self.thread.finished.connect(self.thread.deleteLater)

        # Connect signals with slots. A slot is a Python callable
        self.worker.eeg_data.connect(self.__view.graph_data)
        self.worker.spectra_data.connect(self.__view.graph_spectra)
        self.worker.asym_data.connect(self.__view.graph_asym)
        # self.worker.lpe_data.connect(self.__view.graph_lpe)
        self.worker.light_data.connect(self.__view.light_graph)
        self.worker.bar_data.connect(self.__view.bar_graph)

    def worker_thread(self):
        """
        Start the worker thread.
        """
        self.thread.start()

    def start(self):
        """
        Call the start function of the model and the worker_thread function
        of the controller.
        """
        self.__model.start()
        self.worker_thread()

    def stop(self):
        """
        Call the stop function of the model.
        """
        self.__model.stop()
        print('Stop Data')

    def finish_thread(self):
        """
        Call the finish_thread function of the model and stop the worker.
        Also exit the thread and wait until it actually exits.
        """
        if self.thread.isRunning():
            print("Stop worker thread")
            self.__model.finish_thread()
            self.worker.stop()
            self.thread.exit()
            self.thread.wait()
        else:
            print("Worker thread is not running")
