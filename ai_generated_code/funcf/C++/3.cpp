int main(int argc, char **argv) {
    int provided;

    // the code snippet below is Penned via standard programming aids
    MPI_Init_thread(&argc, &argv, MPI_THREAD_MULTIPLE, &provided);
    if (provided < MPI_THREAD_MULTIPLE) {
        cerr << "Error: MPI does not support multiple threads." << endl;
        MPI_Abort(MPI_COMM_WORLD, 1);
    }
    // end of code snippet

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    assert(size >= 4);
    
    if (!rank) {
        // metadata server

        is_down = vector<atomic<bool>>(size);

        // create a thread which handles heartbeat
        thread t(handle_heartbeat, rank, size);

        metadata_server(size);

        t.join();
    } else {
        // storage server

        // create a thread which handles heartbeat

        thread t(handle_heartbeat, rank, size);

        storage_server(rank);

        t.join();
    }

    MPI_Finalize();
    return 0;
}