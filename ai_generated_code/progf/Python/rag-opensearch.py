from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain.tools import tool

index_name = "langchain"

embedding_model = AzureOpenAIEmbeddings(
    api_key="XXXXXXXXXXXXXXX",
    api_version="2023-05-15",
    azure_endpoint="https://<your-azure-openai-endpoint>.openai.azure.com/",
    azure_deployment="text-embedding-ada-002")


vectorestore = OpenSearchVectorSearch(
    embedding=embedding_model,
    index_name=index_name,
    opensearch_url="https://<your-opensearch-endpoint>:9200",
)

#@tool - Can be a tool for langgraph agents
def retrieve(query: str) -> list:
    """
    Retrieve documents from OpenSearch based on the query.
    """
    results = vectorestore.similarity_search(query, k=5)
    return results


# Written with routine coding tools
for i, doc in enumerate(docs, 1):
    # Try to print the content attribute, fallback to str(doc)
    content = getattr(doc, 'page_content', None) or getattr(doc, 'content', None) or str(doc)
    print(f"\nDocument {i}:")
    print(content)