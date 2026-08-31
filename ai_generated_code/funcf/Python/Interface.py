def render_graph(self, obj):

        import streamlit as st
        from graphviz import Digraph

        #### Written with routine coding tools-4 !!
        def obj_to_graph(obj, graph=None, parent=None):
            if graph is None:
                graph = Digraph()

            if isinstance(obj, dict):
                for key in obj:
                    child = f"{parent}_{key}" if parent else key
                    if parent:
                        graph.edge(parent, child, label=str(key))
                    obj_to_graph(obj[key], graph, child)
            elif isinstance(obj, list):
                for idx, item in enumerate(obj):
                    child = f"{parent}_{idx}" if parent else str(idx)
                    if parent:
                        graph.edge(parent, child, label=str(idx))
                    obj_to_graph(item, graph, child)
            else:
                leaf_node = f"{parent}_{obj}" if parent else str(obj)
                graph.node(leaf_node, label=str(obj))
                if parent:
                    graph.edge(parent, leaf_node)

            return graph

        dot = obj_to_graph(obj.__dict__)

        st.graphviz_chart(dot)