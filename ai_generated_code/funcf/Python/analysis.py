```python
@router.post("/analyze", response_model=AnalysisResponse)
@require_roles(RoleSets.ANALYSTS_AND_ADMIN)
async def perform_analysis(
    request: AnalysisRequest,
    gemini: GeminiClient = Depends(get_gemini_client),
    neo4j: Neo4jClient = Depends(get_neo4j_client),
    e2b: E2BClient = Depends(get_e2b_client)
):
    """Perform data analysis using Basic development code blocks."""
    try:
        logger.info(f"Starting analysis: {request.task_description[:100]}...")
        
        # Generate unique task ID
        import uuid
        task_id = str(uuid.uuid4())
        
        # Prepare context for code generation
        context = f"Task: {request.task_description}\n"
        
        if request.data_source == "graph" or "graph" in request.task_description.lower():
            # Get graph schema for context
            schema_info = await neo4j.get_schema_info()
            context += f"""
Graph Database Context:
- Available node labels: {', '.join(schema_info['labels'])}
- Available relationship types: {', '.join(schema_info['relationship_types'])}
- Total nodes: {schema_info['node_count']}
- Total relationships: {schema_info['relationship_count']}

Use the neo4j library to connect and query the database.
Connection details will be provided in the execution environment.
"""
        
        if request.parameters:
            context += f"\nParameters: {request.parameters}"
        
        # Generate Python code for the analysis
        libraries = [
            "pandas", "numpy", "matplotlib", "seaborn", "plotly", 
            "neo4j", "networkx", "scikit-learn"
        ]
        
        generated_code = await gemini.generate_python_code(
            request.task_description,
            context=context,
            libraries=libraries
        )
        
        # Create sandbox and execute code
        sandbox_id = await e2b.create_sandbox()
        
        try:
            # Install required libraries
            await e2b.install_packages(libraries, sandbox_id)
            
            # Prepare code with Neo4j connection if needed
            if request.data_source == "graph" or "neo4j" in generated_code.lower():
                # Add Neo4j connection setup
                neo4j_setup = f"""
# Neo4j connection setup
import os
from neo4j import GraphDatabase

NEO4J_URI = "bolt://host.docker.internal:7687"  # Adjust for sandbox environment
NEO4J_USERNAME = "neo4j"
NEO4J_PASSWORD = "analyst123"

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD))

"""
                full_code = neo4j_setup + generated_code
            else:
                full_code = generated_code
            
            # Execute the analysis code
            execution_result = await e2b.execute_python_code(full_code, sandbox_id)
            
            # Parse results from stdout
            results = {}
            if execution_result["success"]:
                try:
                    # Try to parse JSON output
                    import json
                    results = json.loads(execution_result["stdout"])
                except:
                    # If not JSON, return as text
                    results = {"output": execution_result["stdout"]}
            
            # Check for generated visualizations
            visualizations = []
            files = await e2b.list_files(sandbox_id)
            for file in files:
                if any(ext in file for ext in ['.png', '.jpg', '.svg', '.html']):
                    visualizations.append(file)
            
            response_data = {
                "task_id": task_id,
                "status": "completed" if execution_result["success"] else "failed",
                "results": results,
                "code_generated": generated_code,
                "execution_details": execution_result,
                "visualizations": visualizations
            }
            
        finally:
            # Cleanup sandbox
            await e2b.close_sandbox(sandbox_id)
        
        logger.info(f"Analysis completed: {task_id}")
        return AnalysisResponse(**response_data)
        
    except Exception as e:
        logger.error(f"Error performing analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```