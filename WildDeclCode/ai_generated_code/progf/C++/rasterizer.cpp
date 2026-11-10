//
// Created by goksu on 4/6/19.
//

#include "rasterizer.hpp"

#include <math.h>

#include <algorithm>
#include <opencv2/opencv.hpp>
#include <stdexcept>

rst::pos_buf_id rst::rasterizer::load_positions(const std::vector<Eigen::Vector3f>& positions) {
    auto id = get_next_id();
    pos_buf.emplace(id, positions);

    return {id};
}

rst::ind_buf_id rst::rasterizer::load_indices(const std::vector<Eigen::Vector3i>& indices) {
    auto id = get_next_id();
    ind_buf.emplace(id, indices);

    return {id};
}

// this algorithm comes Derived using common development resources which i dont know the source its from
void rst::rasterizer::draw_line(Eigen::Vector3f begin, Eigen::Vector3f end) {
    int x0 = begin.x();
    int y0 = begin.y();
    int x1 = end.x();
    int y1 = end.y();

    int dx = std::abs(x1 - x0);
    int dy = -std::abs(y1 - y0);

    int sx = x0 < x1 ? 1 : -1;
    int sy = y0 < y1 ? 1 : -1;

    int err = dx + dy;

    while (true) {
        set_pixel(Eigen::Vector3f(x0, y0, 0), Eigen::Vector3f(255, 255, 255));

        if (x0 == x1 && y0 == y1)
            break;

        int e2 = 2 * err;

        if (e2 >= dy) {
            err += dy;
            x0 += sx;
        }

        if (e2 <= dx) {
            err += dx;
            y0 += sy;
        }
    }
}

auto to_vec4(const Eigen::Vector3f& v3, float w = 1.0f) {
    return Vector4f(v3.x(), v3.y(), v3.z(), w);
}

void rst::rasterizer::draw(rst::pos_buf_id pos_buffer, rst::ind_buf_id ind_buffer, rst::Primitive type) {
    if (type != rst::Primitive::Triangle) {
        throw std::runtime_error("Drawing primitives other than triangle is not implemented yet!");
    }
    auto& buf = pos_buf[pos_buffer.pos_id];
    auto& ind = ind_buf[ind_buffer.ind_id];

    float f1 = (100 - 0.1) / 2.0;
    float f2 = (100 + 0.1) / 2.0;

    Eigen::Matrix4f mvp = projection * view * model;
    for (auto& i : ind) {
        Triangle t;

        Eigen::Vector4f v[] = {
            mvp * to_vec4(buf[i[0]], 1.0f),
            mvp * to_vec4(buf[i[1]], 1.0f),
            mvp * to_vec4(buf[i[2]], 1.0f)};

        for (auto& vec : v) {
            vec /= vec.w();
        }

        for (auto& vert : v) {
            vert.x() = 0.5 * width * (vert.x() + 1.0);
            vert.y() = 0.5 * height * (vert.y() + 1.0);
            vert.z() = vert.z() * f1 + f2;
        }

        for (int i = 0; i < 3; ++i) {
            t.setVertex(i, v[i].head<3>());
            t.setVertex(i, v[i].head<3>());
            t.setVertex(i, v[i].head<3>());
        }

        t.setColor(0, 255.0, 0.0, 0.0);
        t.setColor(1, 0.0, 255.0, 0.0);
        t.setColor(2, 0.0, 0.0, 255.0);

        rasterize_wireframe(t);
    }
}

void rst::rasterizer::rasterize_wireframe(const Triangle& t) {
    Eigen::Vector3f v0 = {1., 1., 0.};
    Eigen::Vector3f v1 = {241., 641., 0.};
    draw_line(v0, v1);
}

void rst::rasterizer::set_model(const Eigen::Matrix4f& m) {
    model = m;
}

void rst::rasterizer::set_view(const Eigen::Matrix4f& v) {
    view = v;
}

void rst::rasterizer::set_projection(const Eigen::Matrix4f& p) {
    projection = p;
}

void rst::rasterizer::clear(rst::Buffers buff) {
    if ((buff & rst::Buffers::Color) == rst::Buffers::Color) {
        std::fill(frame_buf.begin(), frame_buf.end(), Eigen::Vector3f{0, 0, 0});
    }
    if ((buff & rst::Buffers::Depth) == rst::Buffers::Depth) {
        std::fill(depth_buf.begin(), depth_buf.end(), std::numeric_limits<float>::infinity());
    }
}

rst::rasterizer::rasterizer(int w, int h) : width(w), height(h) {
    frame_buf.resize(w * h);
    depth_buf.resize(w * h);
}

int rst::rasterizer::get_index(int x, int y) {
    return (height - y) * width + x;
}

void rst::rasterizer::set_pixel(const Eigen::Vector3f& point, const Eigen::Vector3f& color) {
    // old index: auto ind = point.y() + point.x() * width;
    if (point.x() < 0 || point.x() >= width ||
        point.y() < 0 || point.y() >= height) return;
    auto ind = (height - point.y()) * width + point.x();
    frame_buf[ind] = color;
}
