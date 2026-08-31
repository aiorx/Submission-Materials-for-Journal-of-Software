/*
 * The project is a individual task as well as the usage
 * of the Internet and AI, including ChatGPT and Deepseek AI.
 */

#include <math.h>
#include <omp.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define EPSILON_0 0.001

/**
 * @brief AoS structure of the particles.
 *
 */
typedef struct
{
    double pos_x;
    double pos_y;
    double mass;
    double velocity_x;
    double velocity_y;
    double brightness;
} Particle;

/**
 * @brief SoA structure of the particles.
 *
 */
typedef struct
{
    double *pos_x;
    double *pos_y;
    double *mass;
    double *velocity_x;
    double *velocity_y;
    double *brightness;
} ParticleData;

/**
 * @brief Penned via standard programming aids.
 *
 */
typedef struct
{
    int N;            // Number of stars/particles
    char *filename;   // Initial configuration file name
    int nsteps;       // Number of timesteps
    double delta_t;   // Timestep value
    double theta_max; // theta_max value
} SimulationParams;

/**
 * @brief Parsing of the arguments from the terminal into proper variables.
 *        Penned via standard programming aids.
 *
 * @param argc Arguments count.
 * @param argv Arguments variable.
 * @param params Simulation params to be modified.
 * @return int Exit status of the program.
 */
int parse_arguments(int argc, char *argv[], SimulationParams *params)
{
    char *endptr;

    if (argc != 6)
    {
        fprintf(stderr, "Usage: %s N filename nsteps delta_t theta_max\n", argv[0]);
        fprintf(stderr, "Arguments:\n");
        fprintf(stderr, "  N         - Number of stars/particles (positive integer)\n");
        fprintf(stderr, "  filename  - Initial configuration file name\n");
        fprintf(stderr, "  nsteps    - Number of timesteps (positive integer)\n");
        fprintf(stderr, "  delta_t   - Timestep value (positive float)\n");
        fprintf(stderr, "  theta_max  - Value for theta_max\n");
        return 1;
    }

    params->N = strtol(argv[1], &endptr, 10);
    if (*endptr != '\0' || params->N <= 0)
    {
        fprintf(stderr, "Error: Invalid N. Must be positive integer.\n");
        return 1;
    }

    params->filename = argv[2];
    if (strlen(params->filename) == 0)
    {
        fprintf(stderr, "Error: Filename cannot be empty.\n");
        return 1;
    }

    params->nsteps = strtol(argv[3], &endptr, 10);
    if (*endptr != '\0' || params->nsteps <= 0)
    {
        fprintf(stderr, "Error: Invalid nsteps. Must be positive integer.\n");
        return 1;
    }

    params->delta_t = strtod(argv[4], &endptr);
    if (*endptr != '\0' || params->delta_t <= 0)
    {
        fprintf(stderr, "Error: Invalid delta_t. Must be positive float.\n");
        return 1;
    }

    params->theta_max = strtod(argv[5], &endptr);
    if (*endptr != '\0' || params->theta_max < 0)
    {
        fprintf(stderr, "Error: Invalid theta_max. Must be positive float.\n");
        return 1;
    }

    return 0;
}

/**
 * @brief Create a new quadtree node.
 *
 * @param xmin Minimum x value.
 * @param xmax Maximum x value.
 * @param ymin Minimum y value.
 * @param ymax Maximum y value.
 * @return QuadtreeNode* New quadtree node.
 */
// 修改后的 QuadtreeNode 结构，增加 count 字段
typedef struct QuadtreeNode
{
    double xmin, xmax;
    double ymin, ymax;
    int particle_index; // 如果为叶子节点，存储粒子索引；如果没有粒子，设为 -1
    int count;          // 当前节点内存入的粒子数（当未细分时有效）
    double total_mass;
    double center_of_mass_x;
    double center_of_mass_y;
    struct QuadtreeNode *one;
    struct QuadtreeNode *two;
    struct QuadtreeNode *three;
    struct QuadtreeNode *four;
} QuadtreeNode;

/**
 * @brief Create a new quadtree node.
 */
QuadtreeNode *create_quadtree(double xmin, double xmax, double ymin, double ymax)
{
    QuadtreeNode *node = malloc(sizeof(QuadtreeNode));
    node->xmin = xmin;
    node->xmax = xmax;
    node->ymin = ymin;
    node->ymax = ymax;
    node->particle_index = -1;
    node->count = 0;
    node->total_mass = 0.0;
    node->center_of_mass_x = 0.0;
    node->center_of_mass_y = 0.0;
    node->one = NULL;
    node->two = NULL;
    node->three = NULL;
    node->four = NULL;
    return node;
}

/**
 * @brief Get the quadrant (1,2,3,4) of the particle relative to this node.
 */
int get_quadrant(QuadtreeNode *node, double x, double y)
{
    double xmid = (node->xmin + node->xmax) / 2;
    double ymid = (node->ymin + node->ymax) / 2;
    if (x <= xmid)
    {
        if (y <= ymid)
            return 1;
        else
            return 2;
    }
    else
    {
        if (y <= ymid)
            return 4;
        else
            return 3;
    }
}

/**
 * @brief Insert a particle (given by its index in the SoA structure) into the tree.
 * 根据伪代码的逻辑修改：
 *  - 如果节点为空（count==0）：直接存储新粒子。
 *  - 如果节点已有1个粒子（count==1）：先将已有粒子移入子节点，再插入新粒子。
 *  - 如果节点已有多个粒子：直接递归插入到对应子节点。
 *  最后更新当前节点的 count、total_mass 和 center_of_mass。
 2|3
 - -
 1|4
 1: create_quadtree(node->xmin, xmid, node->ymin ,ymid);
 2: create_quadtree(node->xmin, xmid, ymid, node->ymax);
 3: create_quadtree(xmid, node->xmax,  ymid, node->ymax);
 4: create_quadtree(xmid, node->xmax, node->ymin, ymid);
 */
void insert_particle(QuadtreeNode *node, ParticleData *particles, size_t idx)
{
    // 情况1：当前节点为空
    if (node->count == 0)
    {
        node->particle_index = idx;
        node->count = 1;
        node->total_mass = particles->mass[idx];
        node->center_of_mass_x = particles->pos_x[idx];
        node->center_of_mass_y = particles->pos_y[idx];
        return;
    }

    double xmid = (node->xmin + node->xmax) / 2.0;
    double ymid = (node->ymin + node->ymax) / 2.0;

    // 情况2：当前节点只有1个粒子且未细分（叶子节点）
    if (node->count == 1 && node->particle_index != -1)
    {
        // 将已有粒子重新插入到子节点中
        // 这里只处理旧粒子，新粒子在后面处理
        int quadrant_old = get_quadrant(node, particles->pos_x[node->particle_index], particles->pos_y[node->particle_index]);
        switch (quadrant_old)
        {
        case 1:
            if (node->one == NULL)
                node->one = create_quadtree(node->xmin, xmid, node->ymin, ymid);
            insert_particle(node->one, particles, node->particle_index);
            break;
        case 2:
            if (node->two == NULL)
                node->two = create_quadtree(node->xmin, xmid, ymid, node->ymax);
            insert_particle(node->two, particles, node->particle_index);
            break;
        case 3:
            if (node->three == NULL)
                node->three = create_quadtree(xmid, node->xmax, ymid, node->ymax);
            insert_particle(node->three, particles, node->particle_index);
            break;
        case 4:
            if (node->four == NULL)
                node->four = create_quadtree(xmid, node->xmax, node->ymin, ymid);
            insert_particle(node->four, particles, node->particle_index);
            break;
        }
        // 清除当前节点存储的单个粒子索引
        node->particle_index = -1;
    }

    // 情况3：递归插入新粒子到相应的子节点
    int quadrant_new = get_quadrant(node, particles->pos_x[idx], particles->pos_y[idx]);
    switch (quadrant_new)
    {
    case 1:
        if (node->one == NULL)
            node->one = create_quadtree(node->xmin, xmid, node->ymin, ymid);
        insert_particle(node->one, particles, idx);
        break;
    case 2:
        if (node->two == NULL)
            node->two = create_quadtree(node->xmin, xmid, ymid, node->ymax);
        insert_particle(node->two, particles, idx);
        break;
    case 3:
        if (node->three == NULL)
            node->three = create_quadtree(xmid, node->xmax, ymid, node->ymax);
        insert_particle(node->three, particles, idx);
        break;
    case 4:
        if (node->four == NULL)
            node->four = create_quadtree(xmid, node->xmax, node->ymin, ymid);
        insert_particle(node->four, particles, idx);
        break;
    }

    // 最后：更新当前节点的聚合信息
    double old_mass = node->total_mass;
    node->count++; // 增加计数
    node->total_mass += particles->mass[idx];
    node->center_of_mass_x = (node->center_of_mass_x * old_mass + particles->mass[idx] * particles->pos_x[idx]) / node->total_mass;
    node->center_of_mass_y = (node->center_of_mass_y * old_mass + particles->mass[idx] * particles->pos_y[idx]) / node->total_mass;
}

double distance(double x1, double y1, double x2, double y2)
{
    return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

void compute_accelerate(double *a_x, double *a_y, QuadtreeNode *node, ParticleData *particles, size_t idx, double G, double theta_max)
{
    if (node == NULL)
    {
        return;
    }

    // 计算当前粒子与节点质心之间的距离及方向
    double dx = node->center_of_mass_x - particles->pos_x[idx];
    double dy = node->center_of_mass_y - particles->pos_y[idx];
    double dist = sqrt(dx * dx + dy * dy); // 防止除零
    double size = fmax(node->xmax - node->xmin, node->ymax - node->ymin);
    const double dist_inv_3 = 1.0 / ((dist + EPSILON_0) * (dist + EPSILON_0) * (dist + EPSILON_0));

    // 当节点内只有一个粒子时，直接计算该粒子的贡献
    if (node->count == 1)
    {
        if (node->particle_index != (int)idx)
        {
            double force = (G * particles->mass[node->particle_index]);
            *a_x += force * (dx * dist_inv_3);
            *a_y += force * (dy * dist_inv_3);
        }
        return;
    }

    // 当节点足够远时，使用该节点的质心近似计算加速度

    if ((size / dist) < theta_max)
    {
        // 避免对自身计算
        if (node->particle_index == (int)idx)
        {
            return;
        }
        double force = (G * node->total_mass);
        *a_x += force * (dx * dist_inv_3);
        *a_y += force * (dy * dist_inv_3);
        return;
    }

    // 如果是叶子节点，直接计算该叶子中粒子的贡献（注意避免重复计算）

    if (node->one == NULL && node->particle_index != -1)
    {
        if (node->particle_index != (int)idx)
        {
            double dx_leaf = particles->pos_x[node->particle_index] - particles->pos_x[idx];
            double dy_leaf = particles->pos_y[node->particle_index] - particles->pos_y[idx];
            double dist_leaf = sqrt(dx_leaf * dx_leaf + dy_leaf * dy_leaf) + EPSILON_0;
            double dist_leaf_inv_3 = 1.0 / (dist_leaf * dist_leaf * dist_leaf);
            double force = (G * particles->mass[node->particle_index]);
            *a_x += force * (dx_leaf * dist_leaf_inv_3);
            *a_y += force * (dy_leaf * dist_leaf_inv_3);
        }
        return;
    }

    // 否则递归遍历四个子节点
    if (node->one)
        compute_accelerate(a_x, a_y, node->one, particles, idx, G, theta_max);
    if (node->two)
        compute_accelerate(a_x, a_y, node->two, particles, idx, G, theta_max);
    if (node->three)
        compute_accelerate(a_x, a_y, node->three, particles, idx, G, theta_max);
    if (node->four)
        compute_accelerate(a_x, a_y, node->four, particles, idx, G, theta_max);
}

void free_quadtree(QuadtreeNode *node)
{
    if (node == NULL)
    {
        return;
    }
    free_quadtree(node->one);
    free_quadtree(node->two);
    free_quadtree(node->three);
    free_quadtree(node->four);
    free(node);
}
// 问题：四叉树每一步的更新
// prev被重置？
int run_simulation_vv(ParticleData *particles,
                      const size_t num_particles,
                      const double delta_t,
                      const int t_steps,
                      const double theta_max)
{
    const double G = 100.0 / num_particles;
    double *a_x = malloc(num_particles * sizeof(double));
    double *a_y = malloc(num_particles * sizeof(double));

    printf("Running simulation: ||");
    fflush(stdout);
    // Create the quadtree
    QuadtreeNode *quadtree = create_quadtree(0.0, 1.0, 0.0, 1.0);

    for (size_t i = 0; i < num_particles; i++)
    {
        insert_particle(quadtree, particles, i);
    }

    double *a_x_local_prev = malloc(num_particles * sizeof(double));
    double *a_y_local_prev = malloc(num_particles * sizeof(double));

    // reset previous local forces to zero
    memset(a_x_local_prev, 0, num_particles * sizeof(double));
    memset(a_y_local_prev, 0, num_particles * sizeof(double));

    // 使用当前四叉树计算初始加速度 a(t=0)
    memset(a_x, 0, num_particles * sizeof(double));
    memset(a_y, 0, num_particles * sizeof(double));
    for (size_t i = 0; i < num_particles; i++)
    {
        compute_accelerate(&a_x[i], &a_y[i], quadtree, particles, i, G, theta_max);
    }
    // 将初始加速度复制到保存“上一时刻加速度”的数组中
    memcpy(a_x_local_prev, a_x, num_particles * sizeof(double));
    memcpy(a_y_local_prev, a_y, num_particles * sizeof(double));

    // Run the simulation
    for (int t = 0; t < t_steps; t++)
    {
        // progress indicator
        if (t % (t_steps / 10) == t_steps / 10 - 1)
        {
            printf("*");
            fflush(stdout);
        }

        // --- 第一步：用 a(t) 更新位置 ---
        for (size_t i = 0; i < num_particles; i++)
        {
            particles->pos_x[i] += delta_t * particles->velocity_x[i] + 0.5 * delta_t * delta_t * a_x[i];
            particles->pos_y[i] += delta_t * particles->velocity_y[i] + 0.5 * delta_t * delta_t * a_y[i];
        }
        // 更新四叉树：先释放旧树，再用更新后的位置重建树
        free_quadtree(quadtree);
        quadtree = create_quadtree(0.0, 1.0, 0.0, 1.0);
        for (size_t i = 0; i < num_particles; i++)
        {
            insert_particle(quadtree, particles, i);
        }

        // Reset global forces to zero
        memset(a_x, 0, num_particles * sizeof(double));
        memset(a_y, 0, num_particles * sizeof(double));

        // Compute forces

        for (size_t i = 0; i < num_particles; i++)
        {
            compute_accelerate(&a_x[i], &a_y[i], quadtree, particles, i, G, theta_max);
        }

        // Update velocities
        for (size_t i = 0; i < num_particles; i++)
        {
            // 2nd order Velocity Verlet
            particles->velocity_x[i] += delta_t * 0.5 * (a_x_local_prev[i] + a_x[i]);
            particles->velocity_y[i] += delta_t * 0.5 * (a_y_local_prev[i] + a_y[i]);
        }

        // copy local forces to previous local forces
        memcpy(a_x_local_prev, a_x, num_particles * sizeof(double));
        memcpy(a_y_local_prev, a_y, num_particles * sizeof(double));
    }

    printf("||\n");

    free(a_x);
    free(a_y);
    free(a_x_local_prev);
    free(a_y_local_prev);

    // free quadtree
    free_quadtree(quadtree);

    return 0;
}

int run_simulation_os(ParticleData *particles,
                      const size_t num_particles,
                      const double delta_t,
                      const int t_steps,
                      const double theta_max)
{
    const double G = 100.0 / num_particles;
    double *a_x = malloc(num_particles * sizeof(double));
    double *a_y = malloc(num_particles * sizeof(double));

    printf("Running simulation: ||");
    fflush(stdout);
    // Create the quadtree
    QuadtreeNode *quadtree = create_quadtree(0.0, 1.0, 0.0, 1.0);

    for (size_t i = 0; i < num_particles; i++)
    {
        insert_particle(quadtree, particles, i);
        // printf("Inserting particle %zu\n", i);
    }

    // Run the simulation
    for (int t = 0; t < t_steps; t++)
    {
        // progress indicator
        if (t % (t_steps / 10) == t_steps / 10 - 1)
        {
            printf("*");
            fflush(stdout);
        }
        // Reset global forces to zero
        memset(a_x, 0, num_particles * sizeof(double));
        memset(a_y, 0, num_particles * sizeof(double));

        // Compute forces

        for (size_t i = 0; i < num_particles; i++)
        {
            compute_accelerate(&a_x[i], &a_y[i], quadtree, particles, i, G, theta_max);
        }

        // Update positions
        for (size_t i = 0; i < num_particles; i++)
        {
            // symplectic Euler
            particles->velocity_x[i] += delta_t * a_x[i];
            particles->velocity_y[i] += delta_t * a_y[i];
            particles->pos_x[i] += delta_t * particles->velocity_x[i];
            particles->pos_y[i] += delta_t * particles->velocity_y[i];
        }

        // update quadtree
        free_quadtree(quadtree);
        quadtree = create_quadtree(0.0, 1.0, 0.0, 1.0);
        for (size_t i = 0; i < num_particles; i++)
        {
            insert_particle(quadtree, particles, i);
        }
    }

    printf("||\n");

    free(a_x);
    free(a_y);

    // free quadtree
    free_quadtree(quadtree);

    return 0;
}
/**
 * @brief Read the .gal file and parse into particles as Array of Struct (AoS).
 *
 * @param filename Filename. Does not perform existance checking prior to the opening.
 * @param particles Particles variable.
 * @param num_particles Size of the particles.
 * @return int Exit status of the program.
 */
int read_gal_file(const char *filename, Particle **particles, size_t *num_particles)
{
    FILE *file = fopen(filename, "rb");

    if (!file)
    {
        perror("Failed to open file");
        return EXIT_FAILURE;
    }

    fseek(file, 0, SEEK_END);
    long file_size = ftell(file);
    fseek(file, 0, SEEK_SET);

    *num_particles = file_size / sizeof(Particle);

    *particles = malloc(file_size);

    if (!*particles)
    {
        perror("Failed to allocate memory");
        fclose(file);
        return 1;
    }

    size_t bytes_read = fread(*particles, sizeof(Particle), *num_particles, file);
    if (bytes_read != *num_particles)
    {
        perror("Failed to read file");
        free(*particles);
        fclose(file);
        return 1;
    }

    fclose(file);
    return 0;
}

/**
 * @brief Write back the result into the .gal file.
 *
 * @param filename Filename. Does not check the execution right prior to the writting.
 * @param particles Particles to be write.
 * @param num_particles Size fo the particles.
 * @return int Exit status of the function.
 */
int write_gal_file(const char *filename, const Particle particles[], size_t num_particles)
{
    FILE *file = fopen(filename, "wb");
    if (!file)
    {
        perror("Failed to open file");
        return 1;
    }

    size_t bytes_write = fwrite(particles, sizeof(Particle), num_particles, file);
    if (bytes_write != num_particles)
    {
        perror("Failed to write file");
        fclose(file);
        return 1;
    }

    fclose(file);
    return 0;
}

/**
 * @brief Print the particles in human readable format. Good for debugging.
 *
 * @param particles AoS of the particles to be print.
 * @param num_particles Size of the particles.
 */
void print_particles(const Particle *particles, const size_t num_particles)
{
    for (size_t i = 0; i < num_particles; i++)
    {
        printf("Particle %zu: Position (%.2f, %.2f), Mass: %.2f, Velocity (%.2f, %.2f), Brightness: %.2f\n",
               i, particles[i].pos_x, particles[i].pos_y, particles[i].mass,
               particles[i].velocity_x, particles[i].velocity_y, particles[i].brightness);
    }
}
void print_particles_data(const ParticleData *particles, const size_t num_particles)
{
    for (size_t i = 0; i < num_particles; i++)
    {
        printf("Particle %zu: Position (%.2f, %.2f), Mass: %.2f, Velocity (%.2f, %.2f), Brightness: %.2f\n",
               i, particles->pos_x[i], particles->pos_y[i], particles->mass[i],
               particles->velocity_x[i], particles->velocity_y[i], particles->brightness[i]);
    }
}
/**
 * @brief COPY the particle from Array of Struct to Struct of Array. Does not free the
 *        original AoS.
 *
 * @param particles Original AoS.
 * @param particle_data Output SoA.
 * @param num_particles Siz eof the particles
 * @return int Exit status of the function.
 */
int turn_particle_to_particle_data(Particle particles[], ParticleData *particle_data, const size_t num_particles)
{
    // Allocate memory for SoA structure
    particle_data->pos_x = aligned_alloc(32, num_particles * sizeof(double));
    particle_data->pos_y = aligned_alloc(32, num_particles * sizeof(double));
    particle_data->velocity_x = aligned_alloc(32, num_particles * sizeof(double));
    particle_data->velocity_y = aligned_alloc(32, num_particles * sizeof(double));
    particle_data->mass = aligned_alloc(32, num_particles * sizeof(double));

    printf("particle_data->pos_x: %d\n", !particle_data->pos_x);
    printf("particle_data->pos_y: %d\n", !particle_data->pos_y);
    printf("particle_data->velocity_x: %d\n", !particle_data->velocity_x);
    printf("particle_data->velocity_y: %d\n", !particle_data->velocity_y);
    printf("particle_data->mass: %d\n", !particle_data->mass);
    printf("I am here  11wefwef");

    if (!particles->pos_x || !particles->pos_y || !particles->velocity_x || 
        !particles->velocity_y || !particles->mass)
    {
        perror("Failed to allocate memory for SoA");

        free(particles);
        free(particle_data->pos_x);
        free(particle_data->pos_y);
        free(particle_data->velocity_x);
        free(particle_data->velocity_y);
        free(particle_data->mass);
        return EXIT_FAILURE;
    }
    printf("I am here  111");

    // Copy data from AoS buffer to SoA structure
    for (size_t i = 0; i < num_particles; i++)
    {
        particle_data->pos_x[i] = particles[i].pos_x;
        particle_data->pos_y[i] = particles[i].pos_y;
        particle_data->velocity_x[i] = particles[i].velocity_x;
        particle_data->velocity_y[i] = particles[i].velocity_y;
        particle_data->mass[i] = particles[i].mass;
    }

    return EXIT_SUCCESS;
}

/**
 * @brief COPY the particle from Struct of Array to Array of Struct. The SoA is FREE().
 *
 * @param particle_data Original SoA.
 * @param particles Output AoS.
 * @param num_particles Size of the particles.
 * @return int
 */
int turn_particle_data_to_particle(const ParticleData particle_data, Particle **particles, const size_t num_particles)
{
    // Copy data from SoA to AoS
    for (size_t i = 0; i < num_particles; i++)
    {
        (*particles)[i].pos_x = particle_data.pos_x[i];
        (*particles)[i].pos_y = particle_data.pos_y[i];
        (*particles)[i].velocity_x = particle_data.velocity_x[i];
        (*particles)[i].velocity_y = particle_data.velocity_y[i];
        (*particles)[i].mass = particle_data.mass[i];
    }

    free(particle_data.pos_x);
    free(particle_data.pos_y);
    free(particle_data.velocity_x);
    free(particle_data.velocity_y);
    free(particle_data.mass);

    return EXIT_SUCCESS;
}

int main(int argc, char *argv[])
{
    // Parsing of the arguments.
    SimulationParams params;
    if (parse_arguments(argc, argv, &params) != EXIT_SUCCESS)
        return EXIT_FAILURE;

    printf("N:         %d\n", params.N);
    printf("Filename:  %s\n", params.filename);
    printf("nsteps:    %d\n", params.nsteps);
    printf("delta_t:   %f\n", params.delta_t);
    printf("theta_max: %f\n", params.theta_max);

    // File reading into Particle AoS.
    Particle *particles = NULL;
    ParticleData particle_datas;
    size_t num_particles = 0;

    read_gal_file(params.filename, &particles, &num_particles);


    // Convert AoS to SoA.
    turn_particle_to_particle_data(particles, &particle_datas, num_particles);

    print_particles_data(&particle_datas, num_particles);

    // Run simulation
    //run_simulation_os(&particle_datas, num_particles, params.delta_t, params.nsteps, params.theta_max);

    // Convert the result from SoA back to AoS.

    turn_particle_data_to_particle(particle_datas, &particles, num_particles);

    // Saving of the result.

    char result_path[256]; // 存储拼接后的路径

    sprintf(result_path, "results/%s", params.filename + 13);
    write_gal_file(result_path, particles, num_particles);

    free(particles);

    return EXIT_SUCCESS;
}
