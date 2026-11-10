```python
def test_create_html_file(self):  # thanks ChatGPT
    source_file = "example.html"
    title = "Example"
    content = "<html><head><title>Example</title></head>"\
        "<body><p>Hello, world!</p></body></html>"
    path, tab = create_html_file(
        self.directory, source_file, title, content)
    self.assertTrue(os.path.isfile(path))
    with open(path, "r") as f:
        self.assertEqual(f.read(), content)
    self.assertEqual(tab, {"url": source_file, "title": title})
```

```python
def test_annotate_node_stats(self):  # thanks ChatGPT
    # Create a test network
    network = nx.barbell_graph(5, 1)

    # Call the function to annotate node stats
    annotate_node_stats(network)

    # Check that the expected attributes have been added to the nodes
    for node_id in network.nodes:
        self.assertTrue("Degree Centrality" in network.nodes[node_id])
        self.assertTrue("Betweenness Centrality" in network.nodes[node_id])
        self.assertTrue("Closeness Centrality" in network.nodes[node_id])
        self.assertTrue("Eigenvector Centrality" in network.nodes[node_id])
        self.assertTrue("Assortativity" in network.nodes[node_id])
```

```python
def test_visualise_network(self):  # thanks ChatGPT
    network = nx.Graph()
    network.add_node(0, Feature="Feature1")
    network.add_node(1, Feature="Feature2")
    metadata = pd.DataFrame(
        {"Taxon": {"Feature1": "A", "Feature2": "B"}})
    metadata.index.name = 'feature-id'
    metadata = Metadata(metadata)

    output_dir = self.directory / 'viz_output'
    os.makedirs(output_dir)
    visualise_network(output_dir, network, metadata)

    self.assertTrue((output_dir / 'index.html').exists())
    self.assertTrue((output_dir / 'assets' / 'css' / 'tabs.css').exists())
    self.assertTrue((output_dir / 'assets' / 'css' / 'vega.css').exists())
```

```python
def test_add_taxonomy_levels(self):  # thanks ChatGPT
    # Define test input data
    data = {
        "Taxon": ["A;B;C", "D;E;F"],
    }
    df = pd.DataFrame(data)

    # Apply function to test data
    df = df.apply(add_taxonomy_levels, axis=1)

    # Define expected output data
    expected_data = {
        "Taxon": ["A;B;C", "D;E;F"],
        "Taxon Level 1": ["A", "D"],
        "Taxon Level 2": ["A;B", "D;E"],
        "Taxon Level 3": ["A;B;C", "D;E;F"],
    }
    expected_df = pd.DataFrame(expected_data)

    # Check that the output matches the expected output
    pd.testing.assert_frame_equal(df, expected_df)
```