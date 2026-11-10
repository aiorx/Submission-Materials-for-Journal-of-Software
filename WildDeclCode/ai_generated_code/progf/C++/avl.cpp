//pratice AVL Skeleton Code _Produced using common development resources _ Based on BST Skeleton Code
#include <cstdlib>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <tuple>
#include <utility>
#include <algorithm>
#include <queue>
#include <cmath>
using namespace std;

const char BUILD = 'B';
const char FIND_MIN = 'm';
const char FIND_MAX = 'M';
const char SEARCH = 'S';
const char INSERT = 'I';
const char DELETE = 'D';
const char INORDER = 'N';
const char PREORDER = 'R';
const char POSTORDER = 'O';

class TreeNode {
public:
  int key;
  int height;
  TreeNode* left;
  TreeNode* right;
  TreeNode(int k, TreeNode* l = nullptr, TreeNode* r = nullptr)
    : key(k), height(1), left(l), right(r) {}
};

class AVLTree {
public:
  TreeNode* root;
  AVLTree() : root(nullptr) {}
  ~AVLTree();

  TreeNode* arrayToAVL(vector<int>&, int, int);  
  bool isEmpty() { return (root == nullptr); }
  TreeNode* findMin(TreeNode*);
  TreeNode* findMax(TreeNode*);
  TreeNode* search(int);
  void insertNode(int);
  void deleteNode(int);
  void writeInorder(ofstream&);
  void writePreorder(ofstream&);
  void writePostorder(ofstream&);
  void printTree();
private:
  int _getHeight(TreeNode*);
  int _getBalance(TreeNode*);
  TreeNode* _rotateLeft(TreeNode*);
  TreeNode* _rotateRight(TreeNode*);
  TreeNode* _balance(TreeNode*);
  void _printSpaces(double, TreeNode*);
  TreeNode* _insert(TreeNode*, int);
  TreeNode* _delete(TreeNode* ,int);
  void Inorder_Recursive(TreeNode*,ofstream&);
  void Preorder_Recursive(TreeNode*,ofstream&);
  void Postorder_Recursive(TreeNode*,ofstream&);
};

// ---------- Implementation Skeleton Below ----------

AVLTree::~AVLTree() {
  if(root==nullptr){return;}

  auto Delete = [](TreeNode* node,auto& self){
    if(node==nullptr){return;}
    self(node->left,self);
    self(node->right,self);
    delete node;
  };

  Delete(root,Delete);
  root = nullptr;
}

// Given sorted array arr[l..r], build a balanced AVL tree
TreeNode* AVLTree::arrayToAVL(vector<int>& arr, int l, int r) {
  if(l>r){return nullptr;}
  
  int mid = l + (r-l)/2;
  TreeNode * node = new TreeNode(arr[mid]);

  node->left = arrayToAVL(arr,l,mid-1);
  node->right = arrayToAVL(arr,mid+1,r);

  node->height = 1 + max(_getHeight(node->left),_getHeight(node->right));
  
  return node;
}

TreeNode* AVLTree::findMin(TreeNode* node) {
  if(root==nullptr){return nullptr;}
  TreeNode* find = node;
  while(find->left!=nullptr){
    find = find->left;
  }
  return find;
}

TreeNode* AVLTree::findMax(TreeNode* node) {
  if(root==nullptr){return nullptr;}
  TreeNode* find = node;
  while(find->right!=nullptr){
    find = find->right;
  }
  return find;
}

TreeNode* AVLTree::search(int query) {
  if(root==nullptr){return nullptr;}
  TreeNode* node = root;
  while(node!=nullptr)
  {
    if(node->key==query)break;
    else if(node->key<query)node=node->right;
    else if(node->key>query)node=node->left;
  }
  return node;
}

TreeNode* AVLTree::_insert(TreeNode* node, int k)
{
  if(node==nullptr){
    return new TreeNode(k);
  }

  if(node->key<k){
    node->right = _insert(node->right,k);
  }

  else if(node->key>k){
    node->left = _insert(node->left,k);
  } else{ return node;}

  node->height = 1 + max(_getHeight(node->left),_getHeight(node->right));

  return _balance(node);
}


void AVLTree::insertNode(int k) 
{
  if(search(k)!=nullptr){exit(1);}
  root = _insert(root,k);
}

TreeNode* AVLTree::_delete(TreeNode* node, int k) 
//재귀를 이용한 delete는 삭제대상부터 거슬러 올라가기 때문에 부모노드를 찾기 위한 반복문 필요X & 높이 및 밸런스 관리에 용이하다.
{
  if(node==nullptr){return nullptr;}

  if(node->key<k){
    node->right = _delete(node->right,k); 
  }
  else if(node->key>k){
    node->left = _delete(node->left,k);
  }
  else{
    if(node->left==nullptr&&node->right==nullptr){
      delete node;
      return nullptr;
    }
    else if(node->left==nullptr){
      TreeNode* child = node->right;
      delete node;
      return child;
    }
    else if(node->right==nullptr){
      TreeNode* child = node->left;
      delete node;
      return child;
    }
    else{
      TreeNode* success = findMin(node->right);
      node->key = success->key;
      node->right = _delete(node->right,success->key);
    }
  }

  node->height = 1 + max(_getHeight(node->left),_getHeight(node->right));
  return _balance(node);
}


void AVLTree::deleteNode(int k) 
{
 if(search(k)==nullptr){cerr<<"Error:Invalid access."<<endl;exit(1);}
 root = _delete(root,k);
}

void AVLTree::writeInorder(ofstream& outFile) { //O(n)
  Inorder_Recursive(root,outFile);
  outFile<<endl;
}

void AVLTree::Inorder_Recursive(TreeNode* node,ofstream& outFile){
  if(node==nullptr){return;}

  Inorder_Recursive(node->left,outFile);
  outFile<<node->key<<" ";
  Inorder_Recursive(node->right,outFile);
}

void AVLTree::writePreorder(ofstream& outFile) {
  Preorder_Recursive(root,outFile);
  outFile<<endl;
}

void AVLTree::Preorder_Recursive(TreeNode* node,ofstream& outFile){
  if(node==nullptr){return;}

  outFile<<node->key<<" ";
  Preorder_Recursive(node->left,outFile);
  Preorder_Recursive(node->right,outFile);
}


void AVLTree::writePostorder(ofstream& outFile) {
  Postorder_Recursive(root,outFile);
  outFile<<endl;
}

void AVLTree::Postorder_Recursive(TreeNode* node,ofstream& outFile)
{
  if(node==nullptr){return;}

  Postorder_Recursive(node->left,outFile);
  Postorder_Recursive(node->right,outFile);
  outFile<<node->key<<" ";
}

int AVLTree::_getHeight(TreeNode* curr) {
  return curr ? curr->height : 0;
}

int AVLTree::_getBalance(TreeNode* curr) {
  return curr ? _getHeight(curr->left) - _getHeight(curr->right) : 0;
}

TreeNode* AVLTree::_rotateLeft(TreeNode* x)//회전에서는 회전만만
{
  TreeNode* y = x->right;
  TreeNode* tmp = y->left; 

  y->left = x;
  x->right = tmp; //기존의 y의 왼쪽 노드를 x의 오른쪽 노드로 

  x->height = max(_getHeight(x->left),_getHeight(x->right))+1;
  y->height = max(_getHeight(y->left),_getHeight(y->right))+1;

  return y;
}

TreeNode* AVLTree::_rotateRight(TreeNode* x) {
  TreeNode* y = x->left;
  TreeNode* tmp = y->right;

  y->right = x;
  x->left = tmp;

  x->height = max(_getHeight(x->left),_getHeight(x->right))+1;
  y->height = max(_getHeight(y->left),_getHeight(y->right))+1;

  return y;
}

TreeNode* AVLTree::_balance(TreeNode* node) {
  int b_factor = _getBalance(node);
  if(b_factor>1)
  {
    if(_getBalance(node->left)>0){
      return _rotateRight(node);
    }
    node->left = _rotateLeft(node->left);
    return _rotateRight(node);
  }
  else if(b_factor<-1)
  {
    if(_getBalance(node->right)<0){
      return _rotateLeft(node);
    }
    node-> right = _rotateRight(node->right);
    return _rotateLeft(node);
  }
  else{return node;}
}

void AVLTree::_printSpaces(double n, TreeNode* curr) {
  for (double i = 0; i < n; ++i)
    cout << "  ";
  if (curr == nullptr)
    cout << " ";
  else
    cout << curr->key;
}

void AVLTree::printTree() {
  if (root == nullptr)
    return;
  queue<TreeNode*> q;
  q.push(root);
  queue<TreeNode*> temp;
  int cnt = 0;
  int height = _getHeight(root) - 1;
  double nMaxNodes = pow(2, height + 1) - 1;
  while (cnt <= height) {
    TreeNode* curr = q.front();
    q.pop();
    if (temp.empty())
      _printSpaces(nMaxNodes / pow(2, cnt + 1) + height - cnt, curr);
    else
      _printSpaces(nMaxNodes / pow(2, cnt), curr);
    if (curr == nullptr) {
      temp.push(nullptr);
      temp.push(nullptr);
    }
    else {
      temp.push(curr->left);
      temp.push(curr->right);
    }
    if (q.empty()) {
      cout << endl << endl;
      q = temp;
      queue<TreeNode*> empty;
      swap(temp, empty);
      ++cnt;
    }
  }
}

// ---------- main ----------

int main(int argc, char* argv[]) {
  if (argc != 3) {
    cerr << "Correct usage: [exe] [input] [output]" << endl;
    exit(1);
  }

  AVLTree tree;
  ifstream inFile(argv[1]);
  ofstream outFile(argv[2]);
  string line;

  while (getline(inFile, line)) {
    char op = line[0];
    istringstream iss(line.substr(1));
    int k;
    TreeNode* found = nullptr;
    vector<int> data;

    switch (op) {
    case BUILD:
      while (iss >> k)
        data.push_back(k);
      tree.root = tree.arrayToAVL(data, 0, data.size() - 1);
      if (tree.root) {
        outFile << BUILD << endl;
      } else {
        cerr << "BUILD: invalid input" << endl;
        exit(1);
      }
      tree.printTree();
      break;
    case FIND_MIN:
      found = tree.findMin(tree.root);
      if (found == nullptr) {
        cerr << "FindMin failed" << endl;
        exit(1);
      } else {
        outFile << found->key << endl;
      }
      break;
    case FIND_MAX:
      found = tree.findMax(tree.root);
      if (found == nullptr) {
        cerr << "FindMax failed" << endl;
        exit(1);
      } else {
        outFile << found->key << endl;
      }
      break;
    case SEARCH:
      if (!(iss >> k)) {
        cerr << "SEARCH: invalid input" << endl;
        exit(1);
      }
      found = tree.search(k);
      if(found == nullptr){
        cerr << "Search Failed."<<endl;
        exit(1);
      }
      else{outFile<<found->key<<endl;}
      break;
    case INORDER:
      tree.writeInorder(outFile);
      break;
    case PREORDER:
      tree.writePreorder(outFile);
      break;
    case POSTORDER:
      tree.writePostorder(outFile);
      break;
    case INSERT:
      if (!(iss >> k)) {
        cerr << "INSERT: invalid input" << endl;
        exit(1);
      }
      if(tree.search(k)!=nullptr){}
      else{
        tree.insertNode(k);
        outFile<<"I "<<k<<endl;
      }
      break;
    case DELETE:
      if (!(iss >> k)) {
        cerr << "DELETE: invalid input" << endl;
        exit(1);
      }
      tree.deleteNode(k);
      outFile<<"D "<<k<<endl;
      break;
    default:
      cerr << "Undefined operator" << endl;
      exit(1);
    }
  }

  outFile.close();
  inFile.close();
}
