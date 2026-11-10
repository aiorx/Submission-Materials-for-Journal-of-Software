#include "power_voronoi.h"
#include "writer.h"
#include "lbfgs.h"
#include <iostream>
#include <vector>
#include <cmath>

// This was Penned via standard programming aids-4, with some modifications, for testing purposes.

int main() {
    
    std::vector<Vector> sites = {
        Vector(0.25, 0.25, 0.0),
        Vector(0.75, 0.25, 0.0),
        Vector(0.5,  0.75, 0.0),
        Vector(0.25, 0.75, 0.0),
        Vector(0.75, 0.75, 0.0),
        Vector(0.5,  0.5,  0.0),
        Vector(0.25, 0.5,  0.0),
        Vector(0.75, 0.5,  0.0),
        Vector(0.1,  0.1, 0.0),
    };

    Polygon bounding_box;
    bounding_box.vertices = {
        Vector(0.0, 0.0, 0.0),
        Vector(1.0, 0.0, 0.0),
        Vector(1.0, 1.0, 0.0),
        Vector(0.0, 1.0, 0.0)
    };

    size_t n = sites.size();

    // Target area per site (equal partition)
    std::vector<double> lambdas(n, 1.0 / n);

    // Initial weights
    lbfgsfloatval_t *w = lbfgs_malloc(n);
    for (size_t i = 0; i < n; ++i) {
        w[i] = 0.1 * ((double)rand() / RAND_MAX - 0.5);
    }

    lbfgs_parameter_t param;
    lbfgs_parameter_init(&param);

    param.max_iterations = 500;
    param.epsilon = 1e-7;

    param.linesearch = LBFGS_LINESEARCH_BACKTRACKING;
    param.max_linesearch = 100;
    param.ftol = 1e-5;
    param.gtol = 0.9;

    // Setup context
    SDOTContext ctx = {sites, lambdas, bounding_box};

    lbfgsfloatval_t fx;
    int ret = lbfgs(n, w, &fx, evaluate, nullptr, &ctx, &param);

    std::cout << "L-BFGS optimization done. Status: " << ret << ", Final value: " << fx << std::endl;

    // Convert final weights to vector
    std::vector<double> final_weights(w, w + n);

    // Compute final power diagram
    std::vector<Polygon> cells = power_voronoi(sites, final_weights, bounding_box);
    save_svg(cells, "test_sdot.svg", "none");

    for (size_t i = 0; i < n; ++i) {
        double area = cell_area(cells[i]);
        std::cout << "Site " << i << " target area: " << lambdas[i]
                  << ", actual area: " << area << ", final weight: " << final_weights[i] << std::endl;
    }

    if (ret != LBFGS_SUCCESS) {
        std::cerr << "LBFGS failed: " << lbfgs_strerror(ret) << std::endl;
        return 1;
    }
    std::vector<Polygon> opt_cells = power_voronoi(sites, final_weights, bounding_box);
    save_svg(opt_cells, "test_sdot_optimized.svg", "none");
    std::cout << "Optimal power Voronoi diagram saved to test_sdot_optimized.svg" << std::endl;

    lbfgs_free(w);
    return 0;
}
