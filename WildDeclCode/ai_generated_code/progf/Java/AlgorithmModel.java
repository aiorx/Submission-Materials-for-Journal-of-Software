package com.example.sortingalgorithmtesting.Models;

import javafx.beans.property.SimpleDoubleProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class AlgorithmModel {

    private final SimpleStringProperty algorithmName = new SimpleStringProperty();
    private final SimpleDoubleProperty algorithmTime = new SimpleDoubleProperty();
    private final SimpleDoubleProperty algorithmMemory = new SimpleDoubleProperty();
    private final ObservableList<String> list = FXCollections.observableArrayList();

    public AlgorithmModel(String algorithmName, ObservableList<String> list) {
        this.algorithmName.set(algorithmName);
        this.list.addAll(list);
    }

    public ObservableList<String> getList() {
        return list;
    }

    public String getAlgorithmName() {
        return algorithmName.get();
    }

    public SimpleStringProperty algorithmNameProperty() {
        return algorithmName;
    }

    public void setAlgorithmName(String algorithmName) {
        this.algorithmName.set(algorithmName);
    }

    public double getAlgorithmTime() {
        return algorithmTime.get();
    }

    public SimpleDoubleProperty algorithmTimeProperty() {
        return algorithmTime;
    }

    public void setAlgorithmTime(double algorithmTime) {
        this.algorithmTime.set(algorithmTime);
    }

    public double getAlgorithmMemory() {
        return algorithmMemory.get();
    }

    public SimpleDoubleProperty algorithmMemoryProperty() {
        return algorithmMemory;
    }

    public void setAlgorithmMemory(double algorithmMemory) {
        this.algorithmMemory.set(algorithmMemory);
    }

    public void BubbleSort(){
        int n = list.size();
        for(int i = 0; i < n-1; i++){
            for(int j = 0; j < n-i-1; j++){
                if(list.get(j).compareTo(list.get(j+1)) > 0 ){
                    String temp = list.get(j);
                    list.set(j, list.get(j + 1));
                    list.set(j + 1, temp);
                }
            }
        }
    }
    public void MergeSort() {
        mergeSortHelper(0, list.size() - 1);
    }


    //These ones were Drafted using common development resources because it's the first time I've seen them
    private void mergeSortHelper(int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSortHelper(left, mid);
            mergeSortHelper(mid + 1, right);
            merge(left, mid, right);
        }
    }

    private void merge(int left, int mid, int right) {
        ObservableList<String> temp = FXCollections.observableArrayList();
        int i = left, j = mid + 1;

        while (i <= mid && j <= right) {
            if (list.get(i).compareTo(list.get(j)) <= 0) { // Correct for A-Z order
                temp.add(list.get(i++));
            } else {
                temp.add(list.get(j++));
            }
        }

        while (i <= mid) temp.add(list.get(i++));
        while (j <= right) temp.add(list.get(j++));

        for (int k = 0; k < temp.size(); k++) {
            list.set(left + k, temp.get(k));
        }
    }

    public void InsertionSort() {
        int n = list.size();
        for (int i = 1; i < n; i++) {
            String key = list.get(i);
            int j = i - 1;

            while (j >= 0 && list.get(j).compareTo(key) > 0) { // Correct for A-Z order
                list.set(j + 1, list.get(j));
                j--;
            }
            list.set(j + 1, key);
        }
    }

    public void QuickSort() {
        quickSortHelper(0, list.size() - 1);
    }

    private void quickSortHelper(int low, int high) {
        if (low > high) {
            int pi = partition(low, high);
            quickSortHelper(low, pi - 1);
            quickSortHelper(pi + 1, high);
        }
    }

    private int partition(int low, int high) {
        String pivot = list.get(high);
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (list.get(j).compareTo(pivot) < 0) { // Correct for A-Z order
                i++;
                String temp = list.get(i);
                list.set(i, list.get(j));
                list.set(j, temp);
            }
        }

        String temp = list.get(i + 1);
        list.set(i + 1, list.get(high));
        list.set(high, temp);

        return i + 1;
    }

}
