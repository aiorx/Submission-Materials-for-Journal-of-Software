#ifndef INCLUDE_UNIT_SCCP_H
#define INCLUDE_UNIT_SCCP_H
#include "llvm/IR/PassManager.h"

using namespace llvm;

namespace cs426 {
/// Sparse Conditional Constant Propagation Optimization Pass
struct UnitSCCP : PassInfoMixin<UnitSCCP> {
  PreservedAnalyses run(Function& F, FunctionAnalysisManager& FAM);
};

class UnitSCCPInfo {
  public:
  UnitSCCPInfo() = default;

  enum ValueType {
    TOP, BOTTOM, CONSTANT
  };

  struct Value_ {
    ValueType type = TOP;
    std::string varname = "";  // virt reg
    Value *value = nullptr;

    // constructor
    Value_(ValueType type = TOP, const std::string& varname = "", Value* value = nullptr):
      type(type), varname(varname), value(value) {}
    
    // this function Aided using common development resources
    friend bool operator==(const Value_& lhs, const Value_& rhs) {
          return lhs.type == rhs.type &&
                lhs.varname == rhs.varname &&
                lhs.value == rhs.value;
    }
    friend bool operator!=(const Value_& lhs, const Value_& rhs) {
      return !(lhs == rhs);
    }
  };

  ValueType meet(Value_ first, Value_ second);
  typedef std::pair<Instruction*, Instruction*> Edge;
  std::map<Value *, Value_> constant_map={};

  // Globals used in analysis
  std::map<Edge, bool> execFlags;
  std::map<Instruction*, Value_> latCell;

  std::vector<Edge> flowWL;
  std::vector<Edge> ssaWL;

  Value_ evaluate(Instruction *inst);
  bool inEdges(Instruction *inst);

  std::set<Instruction*> successors_(Instruction *inst);
  void visitInst(Instruction *inst);
  void visitPhi(Instruction *inst);

};
} // namespace

#endif // INCLUDE_UNIT_SCCP_H
