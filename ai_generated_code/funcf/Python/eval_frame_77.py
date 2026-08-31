```python
# TODO(voz): Consider making "explain" output alongside a run / part of a run
@patch("torch._dynamo.symbolic_convert.explain", True)
def explain(f, *extra_args, **extra_kwargs):
    def inner(*args, **kwargs):
        # TODO(voz): Do we want a decorator for this?
        from . import reset  # type: ignore[attr-defined]

        reset()

        graphs: List[torch.fx.GraphModule] = []
        break_reasons: List[Any] = []
        op_count: int = 0
        ops_per_graph: List[torch.fx.Node] = []
        out_guards: List[_guards.Guard] = []

        def dynamo_graph_accumulating_compiler(
            gm: torch.fx.GraphModule, example_inputs
        ):
            from .backends.debugging import _explain_graph_detail

            nonlocal graphs
            nonlocal op_count
            nonlocal ops_per_graph
            nonlocal break_reasons

            gm, graphs, op_count, ops_per_graph, break_reasons = _explain_graph_detail(
                gm, graphs, op_count, ops_per_graph, break_reasons
            )

            return gm.forward

        def guard_export_print(guards):
            nonlocal out_guards
            out_guards.extend(guards)

        opt_f = optimize(
            dynamo_graph_accumulating_compiler,
            nopython=False,
            guard_export_fn=guard_export_print,
        )(f)
        # TODO(voz): We may have instances of `f` that mutate inputs, we should track sideeffects and reject.
        opt_f(*args, **kwargs)

        graph_count = len(graphs)

        # For the explanation summary, dedupe reasons by the innermost stack frame and dedupe by it.
        deduped_reasons = {}
        for reason in break_reasons:
            innermost_frame = reason.user_stack[-1]
            # __repr__ uniquely identifies a FrameSummary so we can use it for deduping
            deduped_reasons[repr(innermost_frame)] = reason

        formatted_list = ""
        for idx, break_reason in enumerate(deduped_reasons.values()):
            formatted_stack = "".join(traceback.format_list(break_reason.user_stack))
            msg = f"{idx + 1}. Reason: {break_reason.reason}\n   User Stack: {formatted_stack}\n"
            formatted_list += msg

        graph_break_count = graph_count - 1
        compile_time = compile_times(repr="str")

        # TODO(voz): Do we want a decorator for this?
        reset()
        from .backends.debugging import ExplainOutput

        return ExplainOutput(
            graphs,
            graph_count,
            graph_break_count,
            break_reasons,
            op_count,
            ops_per_graph,
            out_guards,
            compile_time,
        )

    if extra_args or extra_kwargs:
        warnings.warn(
            "explain(f, *args, **kwargs) is deprecated, use explain(f)(*args, **kwargs) instead.  "
            "If you don't migrate, we may break your explain call in the future if your user defined kwargs "
            "conflict with future kwargs added to explain(f)."
        )
        return inner(*extra_args, **extra_kwargs)
    else:
        return inner
```