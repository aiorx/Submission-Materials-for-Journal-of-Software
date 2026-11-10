#include "Mesh.h"
#include <vector>

void Mesh::loadVertexs(Vertex* vertices, unsigned int numVertices)
{
	drawCount = numVertices;

	glGenVertexArrays(1, &vertexArrayObject); //generate a vertex array and store it in the VAO
	glBindVertexArray(vertexArrayObject); //bind the VAO (any operation that works on a VAO will work on our bound VAO - binding)

	vector<vec3> positions; //holds the position data
	vector<vec2> textCoords; //holds the texture coordinate data
	vector<vec3> tangents; //holds the tangent data
	vector<vec3> bitangents; //holds the bitangent data

	positions.reserve(numVertices); // reserve the all the space needed to hold our data
	textCoords.reserve(numVertices);
	tangents.reserve(numVertices);
	bitangents.reserve(numVertices);

	for (int i = 0; i < numVertices; i++)
	{
		positions.push_back(vertices[i].pos); //store our array of vertex positon into a list vec3 positions
		textCoords.push_back(vertices[i].texCoord);
		tangents.push_back(vertices[i].tangent);
		bitangents.push_back(vertices[i].bitangent);
	}

	glGenBuffers(NUM_BUFFERS, vertexArrayBuffers); //generate our buffers based of our array of data/buffers - GLuint vertexArrayBuffers[NUM_BUFFERS];
	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[POSITION_VERTEXBUFFER]); //tell opengl what type of data the buffer is (GL_ARRAY_BUFFER), and pass the data
	glBufferData(GL_ARRAY_BUFFER, numVertices * sizeof(positions[0]), &positions[0], GL_STATIC_DRAW); //move the data to the GPU - type of data, size of data, starting address (pointer) of data, where do we store the data on the GPU (determined by type)

	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[TEXCOORD_VB]); //tell opengl what type of data the buffer is (GL_ARRAY_BUFFER), and pass the data
	glBufferData(GL_ARRAY_BUFFER, numVertices * sizeof(textCoords[0]), &textCoords[0], GL_STATIC_DRAW); //move the data to the GPU - type of data, size of data, starting address (pointer) of data, where do we store the data on the GPU

	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[TANGENT_VB]); //bind tangent buffer
	glBufferData(GL_ARRAY_BUFFER, numVertices * sizeof(tangents[0]), &tangents[0], GL_STATIC_DRAW);

	glEnableVertexAttribArray(2);
	glVertexAttribPointer(2, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[BITANGENT_VB]); //bind bitangent buffer
	glBufferData(GL_ARRAY_BUFFER, numVertices * sizeof(bitangents[0]), &bitangents[0], GL_STATIC_DRAW);

	glEnableVertexAttribArray(3);
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindVertexArray(0); // unbind our VAO
}

void Mesh::init(Vertex* vertices, unsigned int numVertices, unsigned int* indices, unsigned int numIndices)
{
	IndexedModel model;

	for (unsigned int i = 0; i < numVertices; i++)
	{
		model.positions.push_back(*vertices[i].GetPos());
		model.texCoords.push_back(*vertices[i].GetTexCoord());
		model.normals.push_back(*vertices[i].GetNormal());
	}

	for (unsigned int i = 0; i < numIndices; i++)
		model.indices.push_back(indices[i]);

	initModel(model);
}

void Mesh::initModel(IndexedModel& model)
{
	vector<vec3> tangents;
	vector<vec3> bitangents;

	calculateTangentsAndBitangents(model.positions, model.texCoords, model.normals, tangents, bitangents, model.indices);

	drawCount = model.indices.size();

	glGenVertexArrays(1, &vertexArrayObject); //generate a vertex array and store it in the VAO
	glBindVertexArray(vertexArrayObject); //bind the VAO (any operation that works on a VAO will work on our bound VAO - binding)

	glGenBuffers(NUM_BUFFERS, vertexArrayBuffers); //generate our buffers based of our array of data/buffers - GLuint vertexArrayBuffers[NUM_BUFFERS];

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[POSITION_VERTEXBUFFER]); //tell opengl what type of data the buffer is (GL_ARRAY_BUFFER), and pass the data
	glBufferData(GL_ARRAY_BUFFER, model.positions.size() * sizeof(model.positions[0]), &model.positions[0], GL_STATIC_DRAW); //move the data to the GPU - type of data, size of data, starting address (pointer) of data, where do we store the data on the GPU (determined by type)
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[TEXCOORD_VB]); //tell opengl what type of data the buffer is (GL_ARRAY_BUFFER), and pass the data
	glBufferData(GL_ARRAY_BUFFER, model.positions.size() * sizeof(model.texCoords[0]), &model.texCoords[0], GL_STATIC_DRAW); //move the data to the GPU - type of data, size of data, starting address (pointer) of data, where do we store the data on the GPU
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[NORMAL_VB]);
	glBufferData(GL_ARRAY_BUFFER, sizeof(model.normals[0]) * model.normals.size(), &model.normals[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(2);
	glVertexAttribPointer(2, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[TANGENT_VB]); //bind tangent buffer
	glBufferData(GL_ARRAY_BUFFER, sizeof(tangents[0]) * tangents.size(), &tangents[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(3);
	glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ARRAY_BUFFER, vertexArrayBuffers[BITANGENT_VB]); //bind bitangent buffer
	glBufferData(GL_ARRAY_BUFFER, sizeof(bitangents[0]) * bitangents.size(), &bitangents[0], GL_STATIC_DRAW);
	glEnableVertexAttribArray(4);
	glVertexAttribPointer(4, 3, GL_FLOAT, GL_FALSE, 0, 0);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, vertexArrayBuffers[INDEX_VB]); //tell opengl what type of data the buffer is (GL_ARRAY_BUFFER), and pass the data
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, model.indices.size() * sizeof(model.indices[0]), &model.indices[0], GL_STATIC_DRAW); //move the data to the GPU - type of data, size of data, starting address (pointer) of data, where do we store the data on the GPU

	glBindVertexArray(0); // unbind our VAO
}

// Aided using common development resources
void Mesh::calculateTangentsAndBitangents(vector<vec3>& positions, vector<vec2>& texCoords, vector<vec3>& normals, vector<vec3>& tangents, vector<vec3>& bitangents, const vector<unsigned int>& indices)
{
	tangents.resize(positions.size(), vec3(0.0f));
	bitangents.resize(positions.size(), vec3(0.0f));

	for (unsigned int i = 0; i < indices.size(); i += 3)
	{
		vec3& v0 = positions[indices[i]];
		vec3& v1 = positions[indices[i + 1]];
		vec3& v2 = positions[indices[i + 2]];

		vec2& uv0 = texCoords[indices[i]];
		vec2& uv1 = texCoords[indices[i + 1]];
		vec2& uv2 = texCoords[indices[i + 2]];

		vec3 deltaPos1 = v1 - v0;
		vec3 deltaPos2 = v2 - v0;

		vec2 deltaUV1 = uv1 - uv0;
		vec2 deltaUV2 = uv2 - uv0;

		float r = 1.0f / (deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x);
		vec3 tangent = (deltaPos1 * deltaUV2.y - deltaPos2 * deltaUV1.y) * r;
		vec3 bitangent = (deltaPos2 * deltaUV1.x - deltaPos1 * deltaUV2.x) * r;

		tangents[indices[i]] += tangent;
		tangents[indices[i + 1]] += tangent;
		tangents[indices[i + 2]] += tangent;

		bitangents[indices[i]] += bitangent;
		bitangents[indices[i + 1]] += bitangent;
		bitangents[indices[i + 2]] += bitangent;
	}

	for (unsigned int i = 0; i < positions.size(); i++)
	{
		tangents[i] = normalize(tangents[i]);
		bitangents[i] = normalize(bitangents[i]);
	}
}


Mesh::Mesh()
{
	drawCount = NULL;
}

void Mesh::loadModel(const string& filename)
{
	IndexedModel model = OBJModel(filename).ToIndexedModel();
	initModel(model);
	Sphere meshSphere();
	Box meshBox();
}

Mesh::~Mesh()
{
	glDeleteVertexArrays(1, &vertexArrayObject); // delete arrays
	glDeleteBuffers(NUM_BUFFERS, vertexArrayBuffers);
}

void Mesh::draw()
{
	glBindVertexArray(vertexArrayObject);

	glDrawElements(GL_TRIANGLES, drawCount, GL_UNSIGNED_INT, 0);
	//glDrawArrays(GL_TRIANGLES, 0, drawCount);

	glBindVertexArray(0);
}

void Mesh::drawVertexes()
{
	glBindVertexArray(vertexArrayObject);
	glDrawArrays(GL_TRIANGLES, 0, drawCount);
	glBindVertexArray(0);
}

void Mesh::updateSphereData(vec3 pos, float radius)
{
	meshSphere.SetPos(pos);
	meshSphere.SetRadius(radius);
}

void Mesh::updateBoxData(vec3 pos, vec3 size)
{
	meshBox.SetPos(pos);
	meshBox.SetSize(size);
}

