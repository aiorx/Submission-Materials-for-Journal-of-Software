#include <Python.h>

// source: https://stackoverflow.com/questions/8001923/python-extension-module-with-variable-number-of-arguments
// source: https://codedamn.com/news/python/implementing-custom-python-c-extensions-step-by-step-guide
// source: a lot Derived using common development resources

void _compute_tensor_index(
    unsigned int order,
    unsigned int *dimensions,
    unsigned long index,
    unsigned int *final
) {
    unsigned int i;
    unsigned long p = 1;
    unsigned int r = 0;

    for(i = 0; i < order; i++) {
        p *= dimensions[i];
    }

    for(i = 0; i < order; i++) {
        p /= dimensions[i];
        final[i] = (index - r) / p;
        r += final[i] * p;
    }
}

unsigned long _compute_linear_index(
    unsigned int order,
    unsigned int *dimensions,
    unsigned int *index
) {
    unsigned long p = 1;
    unsigned long final = 0;
    unsigned int i;

    for(i = 0; i < order; i++) {
        final += index[order-i-1] * p;
        p *= dimensions[order-i-1];
    }

    return final;
}

static PyObject* contraction(PyObject* self, PyObject* args) {
    unsigned long order = PyLong_AsUnsignedLong(PyTuple_GetItem(args, 0));
    unsigned long new_order = order - 2;
    unsigned long I = PyLong_AsUnsignedLong(PyTuple_GetItem(args, 1));
    unsigned long J = PyLong_AsUnsignedLong(PyTuple_GetItem(args, 2));
    unsigned int *dimensions;
    unsigned int *new_dimensions;
    unsigned int *index;
    unsigned int *new_index;
    unsigned long i;
    unsigned int j;
    unsigned int current_i;
    unsigned long p = 1;
    unsigned long new_p = 1;
    unsigned long new_pos;
    double *values;
    double *new_values;
    PyObject *result;
    
    dimensions = malloc(order*sizeof(unsigned int));
    new_dimensions = malloc(new_order*sizeof(unsigned int));
    for(i = 0; i < order; i++) {
        dimensions[i] = PyLong_AsUnsignedLong(PyTuple_GetItem(args, i+3));
        p *= dimensions[i];
    }
    current_i = 0;
    for(i = 0; i < order; i++) {
        if (i == I || i == J) {
            continue;
        } else {
            new_dimensions[current_i] = dimensions[i];
            new_p *= dimensions[i];
            current_i++;
        }
    }

    values = malloc(p*sizeof(double));
    for(i = 0; i < p; i++) {
        values[i] = PyFloat_AsDouble(PyTuple_GetItem(args, i+order+3));
    }

    new_values = malloc(new_p*sizeof(double));
    for(i = 0; i < new_p; i++) {
        new_values[i] = 0;
    }

    // core
    index = malloc(order*sizeof(unsigned int));
    new_index = malloc(new_order*sizeof(unsigned int));
    for(i = 0; i < p; i++) {
        _compute_tensor_index(order, dimensions, i, index);
        if (index[I] == index[J]) {

            // computing new_index
            current_i = 0;
            for(j = 0; j < order; j++) {
                if (j == I || j == J) {
                    continue;
                } else {
                    new_index[current_i] = index[j];
                    current_i++;
                }
            }

            new_pos = _compute_linear_index(new_order, new_dimensions, new_index);
            new_values[new_pos] += values[i];
        }
    }

    result = PyList_New(new_p);
    for(i = 0; i < new_p; i++) {
        PyList_SetItem(result, i, PyFloat_FromDouble(new_values[i]));
    }

    free(dimensions);
    free(new_dimensions);
    free(index);
    free(new_index);
    free(values);
    free(new_values);

    return result;
}

static PyObject* compute_tensor_index(PyObject* self, PyObject* args) {
    Py_ssize_t order = (PyTuple_Size(args) - 1);
    PyObject *result = PyList_New(order);
    unsigned int i;
    unsigned int *dimensions;
    unsigned int *final;
    unsigned long index = PyLong_AsUnsignedLong(PyTuple_GetItem(args, 0));
    
    final = malloc(order*sizeof(unsigned int));
    dimensions = malloc(order*sizeof(unsigned int));
    for(i = 0; i < order; i++) {
        dimensions[i] = PyLong_AsUnsignedLong(PyTuple_GetItem(args, i+1));
    }

    _compute_tensor_index(order, dimensions, index, final);
    
    for(i = 0; i < order; i++) {
        PyList_SetItem(result, i, PyLong_FromLong(final[i]));
    }

    free(dimensions);
    free(final);

    return result;
}

static PyObject* compute_linear_index(PyObject* self, PyObject* args) {
    Py_ssize_t order = PyTuple_Size(args) / 2;
    Py_ssize_t i;
    unsigned int *dimensions;
    unsigned int *index;
    long final = 0;
    
    dimensions = malloc(order*sizeof(unsigned int));
    for(i = 0; i < order; i++) {
        dimensions[i] = PyLong_AsUnsignedLong(PyTuple_GetItem(args, i));
    }

    index = malloc(order*sizeof(unsigned int));
    for(i = 0; i < order; i++) {
        index[i] = PyLong_AsUnsignedLong(PyTuple_GetItem(args, i+order));
    };

    final = _compute_linear_index(order, dimensions, index);

    free(dimensions);
    free(index);

    return PyLong_FromLong(final);
}

static PyMethodDef TensorMethods[] = {
    {"contraction", contraction, METH_VARARGS, "Compute contraction."},
    {"compute_tensor_index", compute_tensor_index, METH_VARARGS, "Compute tensor index."},
    {"compute_linear_index", compute_linear_index, METH_VARARGS, "Compute linear index."},
    {NULL, NULL, 0, NULL} /* Sentinel */
};

static struct PyModuleDef tensor_module = {
    PyModuleDef_HEAD_INIT,
    "tensor", /* name of module */
    NULL,           /* module documentation, may be NULL */
    -1,             /* size of per-interpreter state of the module, or -1 if the module keeps state in global variables. */
    TensorMethods
};

PyMODINIT_FUNC PyInit_tensor(void) {
    return PyModule_Create(&tensor_module);
}