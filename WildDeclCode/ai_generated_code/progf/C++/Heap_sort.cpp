#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>


void Heapify(std::vector<int>& buf, int i, int size) {
    int max = i, child_1 = i * 2 + 1, child_2 = i * 2 + 2;

    if (child_1 < size and buf[child_1] > buf[max]) max = child_1;

    if (child_2 < size and buf[child_2] > buf[max]) max = child_2;

    if (max != i) {
        std::swap(buf[i], buf[max]);
        Heapify(buf, max, size);
    }
}

void BuildHeap(std::vector<int>& buf) {
    int size = buf.size();
    for (int i = size / 2 - 1; i >= 0; i--) {
        Heapify(buf, i, size);
    }
}

void HeapSort(std::vector<int>& buf) {
    BuildHeap(buf);
    int size = buf.size();
    for (int i = size - 1; i > 0; --i) {
        std::swap(buf[0], buf[i]);
        Heapify(buf, 0, i);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Produced using standard development resources

// Функция для визуализации дерева кучи
void PrintHeapTree(const std::vector<int>& buf) {
    int size = buf.size();
    int levels = std::log2(size) + 1; // Количество уровней в дереве

    int index = 0; // Индекс для текущего элемента в массиве
    for (int level = 0; level < levels; ++level) {
        int elementsOnLevel = std::pow(2, level); // Количество элементов на текущем уровне
        int maxElementsOnLevel = std::min(elementsOnLevel, size - index); // Оставшиеся элементы

        // Вывести отступы для каждого уровня, чтобы центрировать элементы
        for (int i = 0; i < (std::pow(2, levels - level - 1) - 1); ++i)
            std::cout << "    "; // Увеличил количество пробелов для лучшей визуализации

        // Вывести все элементы на уровне
        for (int i = 0; i < maxElementsOnLevel; ++i) {
            std::cout << buf[index++] << "    "; // Больше пробелов между элементами
            if (i < maxElementsOnLevel - 1) {
                // Вывести отступы между элементами на одном уровне
                for (int j = 0; j < (std::pow(2, levels - level) - 1); ++j)
                    std::cout << "    "; // Увеличил отступы между элементами
            }
        }
        std::cout << std::endl; // Переход на новую строку для нового уровня
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


int main() {
    std::vector<int> buf = {1, 5, 7, 2, 3, 4, 9, 6, 7, 0, 9};

    std::cout << "Original vector: ";
    for (const auto& i : buf) std::cout << i << ' ';
    std::cout << "\n\n";

    BuildHeap(buf);
    std::cout << "Heap tree visualization before sorting:\n";
    PrintHeapTree(buf);
    std::cout << '\n';

    HeapSort(buf);

    std::cout << "Sorted vector: ";
    for (const auto& i : buf) std::cout << i << ' ';
    std::cout << "\n";

    return 0;
}
