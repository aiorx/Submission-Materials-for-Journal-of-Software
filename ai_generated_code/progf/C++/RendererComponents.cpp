#include <glad/gl.h>
#include "Neutron/Components/RendererComponents.h"
#include "Neutron/GameObject.h"
#include "glm/glm.hpp"
#include "glm/gtc/matrix_transform.hpp"
#include "glm/gtc/type_ptr.hpp"
#include <iostream>

namespace Neutron {

    std::vector<unsigned int> GenerateIndexBuffer(const std::vector<Math::Vector2> &vertices) {
        std::vector<unsigned int> indexBuffer;
        for (int i = 0; i < vertices.size() - 2; i++) {
            indexBuffer.push_back(0);
            indexBuffer.push_back(i + 1);
            indexBuffer.push_back(i + 2);
        }
        return indexBuffer;
    }

    // TODO: this is not a "map". think of a different name.
    std::vector<Color> GenerateColorMap(std::vector<Math::Vector2> &vertices, Color color) {
        std::vector<Color> colorMap;

        for (auto vertex : vertices) {
            colorMap.push_back(color);
        }

        return colorMap;
    }

    // this function was Assisted with basic coding tools not gonna lie
    std::vector<float> PrimitiveVertexBuffer(std::vector<Math::Vector2>& vertices, std::vector<Color>& colors) {
        if (vertices.empty()) return {};

        // Find the min and max coordinates to determine the range
        float minX = vertices[0].x, maxX = vertices[0].x;
        float minY = vertices[0].y, maxY = vertices[0].y;

        for (const auto& vertex : vertices) {
            if (vertex.x < minX) minX = vertex.x;
            if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.y < minY) minY = vertex.y;
            if (vertex.y > maxY) maxY = vertex.y;
        }

        float rangeX = maxX - minX;
        float rangeY = maxY - minY;

        std::vector<float> buffer;

        // todo: get rid of this magic value and use sizeof(float)
        buffer.reserve(vertices.size() * 9); // Each vertex has x, y, r, g, b, a, u, v

        Logger::Log(colors);

        // Normalize positions, assign colors, and texture coordinates in a single pass
        for (size_t i = 0; i < vertices.size(); ++i) {
            const auto& vertex = vertices[i];
            const auto& color = colors[i];

            // Normalize vertex position
            float normalizedX = (vertex.x - minX) / rangeX;
            float normalizedY = (vertex.y - minY) / rangeY;

            // Store vertex position
            buffer.push_back(vertex.x);
            buffer.push_back(vertex.y);

            // Store color
            buffer.push_back(color.red);
            buffer.push_back(color.green);
            buffer.push_back(color.blue);
            buffer.push_back(color.alpha);

            // Store normalized texture coordinates
            buffer.push_back(normalizedX);
            buffer.push_back(normalizedY);
        }

        return buffer;
    }

    std::vector<float> PrimitiveVertexBuffer(std::vector<Math::Vector2> &vertices, Color color) {
        auto colorMap = GenerateColorMap(vertices, color);
        return PrimitiveVertexBuffer(vertices, colorMap);
    }

    std::vector<float> PrimitiveVertexBuffer(std::vector<Math::Vector2> &vertices) {
        return PrimitiveVertexBuffer(vertices, {0, 0, 0});
    }


    void MeshRendererComponent::Draw(bool vulkan) {
        if (shader) {
            shader->Enable();
        } else {
            std::cerr << "Shader is not set" << std::endl;
            return;
        }

        if (texture) {
            texture->Enable();
            shader->setInt("u_Texture", 0);
        }

//        // Bind VAO and draw elements
//        glBindVertexArray(vao);
//        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);
//        glDrawElements(GL_TRIANGLES, indexBuffer.size() * sizeof(Math::Vector2), GL_UNSIGNED_INT, 0);
//        glBindVertexArray(0);
//        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);

        glBindVertexArray(vao);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0); // no need to unbind it every time

        Neutron::Shader::Disable();

        GLenum error = glGetError();
        if (error != GL_NO_ERROR) {
            std::cerr << "OpenGL error: " << error << std::endl;
        }
    }

    MeshRendererComponent* MeshRendererComponent::setShape(std::vector<Math::Vector2> vertexBuffer, std::vector<unsigned int> indexBuffer, Color color) {
        return setShape(vertexBuffer, indexBuffer, GenerateColorMap(vertexBuffer, color));
    }

    MeshRendererComponent* MeshRendererComponent::setShape(std::vector<Math::Vector2> vertexBuffer, std::vector<unsigned int> indexBuffer, std::vector<Color> colors) {
        if (indexBuffer.empty()) {
            indexBuffer = GenerateIndexBuffer(vertexBuffer);
        }

        if (colors.empty()) {
            colors = GenerateColorMap(vertexBuffer, {255, 255, 255});
        }

        // note to self: once the std::move is done you must use the class member because the variable will be uninitialised. This caused me so much headache.
        this->indexBuffer = std::move(indexBuffer);
        this->vertexBuffer = std::move(vertexBuffer);

        std::vector<float> vertices = PrimitiveVertexBuffer(this->vertexBuffer, colors);

        if (shader) {
            this->shader->Enable();
            this->shader->setInt("texture1", 0);
        }

        glGenVertexArrays(1, &vao);
        glGenBuffers(1, &vbo);
        glGenBuffers(1, &ebo);

        // Bind the Vertex Array Object first, then bind and set vertex buffer(s), and then configure vertex attribute(s)
        glBindVertexArray(vao);

        // Bind and set vertex buffer(s)
        glBindBuffer(GL_ARRAY_BUFFER, vbo);
        glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(Vertex), vertices.data(), GL_STATIC_DRAW);

        // Bind and set element buffer (if using indices)
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, this->indexBuffer.size() * sizeof(unsigned int), this->indexBuffer.data(), GL_STATIC_DRAW);

        // Set vertex attribute pointers
        // Position attribute (x, y)
        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, x));
        glEnableVertexAttribArray(0);

        // Color attribute (r, g, b, a)
        glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, r));
        glEnableVertexAttribArray(1);

        // Texture coordinate attribute (u, v)
        glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, u));
        glEnableVertexAttribArray(2);

        // Unbind VBO and VAO
        glBindBuffer(GL_ARRAY_BUFFER, 0);
        glBindVertexArray(0);

        return this;
    }

    MeshRendererComponent::~MeshRendererComponent() {
        glDeleteBuffers(1, &vbo);
        glDeleteBuffers(1, &ebo);
    }

} // namespace Neutron
