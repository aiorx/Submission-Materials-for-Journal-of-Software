#include <stdio.h>
#include "shell.h"
#include "macro.h"

// ------------------ Adapted from standard coding samples --------------------
uint32_t get_bit_range(uint32_t x, int high, int low) {
    int num_bits = high - low + 1;
    uint32_t bitmask = (1 << num_bits) - 1;
    bitmask <<= low;
    return (uint32_t)(x & bitmask) >> low;
}

int sign_extend(int num, int from_bit) {
    int mask = 1 << (from_bit - 1);
    int sign_bit = (num & mask) ? 1 : 0;
    printf("before extended result %d\n", num);
    int extended_num = num;
    if (sign_bit) {
        mask = ~(mask - 1);
        extended_num |= mask;
    }
    printf("extended result %d\n", extended_num);
    return (int) extended_num;
}
// ----------------------------------------------------


void instuction_memory(uint32_t pc, uint32_t *inst) { 
    *inst = mem_read_32(pc);
}

void ctrl(uint32_t inst, int *RegDst, int *Jump, int *Branch, int *MemRead, int *Jal,
        int *MemtoReg, int *ALUop, int *MemWrite, int *ALUSrc, int *RegWrite, int *BranchType, int *Jarl, int *SpecialMemwrite) {
    uint32_t opcode, inst20_15, inst5_0; 
    opcode = get_bit_range(inst, 31, 26); 
    inst20_15 = get_bit_range(inst, 20, 16); 
    inst5_0 = get_bit_range(inst, 5, 0); 
    printf("inst20_15: %x", inst20_15); 
    if (opcode == OPCODE_SPECIAL) { // special type opcode
        *RegDst = 1; 
        *ALUSrc = 0; 
        *MemtoReg = 0;
        *RegWrite = 1; 
        *MemRead = 0; 
        *MemWrite = 0; 
        *Jump = 0; *Jal = 0; *Jarl = 0; 
        *Branch = 0; *BranchType = 0;
        *ALUop = 2;    
        if (inst5_0 == JALR_FUNC) {
            *Jal = 1;
            *Jarl = 1; 
            *Jump = 1; 
        }
        if (inst5_0 == JR_FUNC) {
            *Jal = 0;
            *Jarl = 0; 
            *Jump = 1; 
        }
    } else if (opcode == OPCODE_REGIMM){ 
        // REGIMM type
        if (inst20_15 == REGIMM_BGEZ) { // bgez
            printf("hello bgez");
            *RegDst = 99;  
            *ALUSrc = 0; 
            *MemtoReg = 99;
            *RegWrite = 0; 
            *MemRead = 0; 
            *MemWrite = 1; 
            *Jump = 0; *Jal = 0;
            *Branch = 1; *BranchType = 2; // 2 = BGEZ
            *ALUop = 1;   
        } else if (inst20_15 == REGIMM_BGEZAL) {
            *RegDst = 99;  
            *ALUSrc = 0; 
            *MemtoReg = 99;
            *RegWrite = 1; 
            *MemRead = 0; 
            *MemWrite = 1; 
            *Jump = 0; *Jal = 1;
            *Branch = 1; *BranchType = 2; // 2 = BGEZ
            *ALUop = 1;  
        } else if (inst20_15 == REGIMM_BLTZ) { // bgez
            printf("hello bltz");
            *RegDst = 99;  
            *ALUSrc = 0; 
            *MemtoReg = 99;
            *RegWrite = 0; 
            *MemRead = 0; 
            *MemWrite = 1; 
            *Jump = 0; *Jal = 0;
            *Branch = 1; *BranchType = 3; // 3 = BLTZ
            *ALUop = 1;   
        } else if (inst20_15 == REGIMM_BLTZAL) {
            *RegDst = 99;  
            *ALUSrc = 0; 
            *MemtoReg = 99;
            *RegWrite = 1; 
            *MemRead = 0; 
            *MemWrite = 1; 
            *Jump = 0; *Jal = 1;
            *Branch = 1; *BranchType = 3; // 3 = BLTZ
            *ALUop = 1;  
        }
    } else if (opcode == OPCODE_LUI) { // 15
        *RegDst = 0;  
        *ALUSrc = 1; 
        *MemtoReg = 0;
        *RegWrite = 1; 
        *MemRead = 0; 
        *MemWrite = 0; 
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0; 
    } else if (opcode == OPCODE_LW) { // 35
        *RegDst = 0;  
        *ALUSrc = 1; 
        *MemtoReg = 1;
        *RegWrite = 1; 
        *MemRead = 1; 
        *MemWrite = 0; 
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0; 
    } else if (opcode == OPCODE_BEQ) { // 4
        *RegDst = 99;  
        *ALUSrc = 0; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 0; 
        *MemWrite = 1; 
        *Jump = 0; *Jal = 0;
        *Branch = 1; *BranchType = 1; // 1 = BEQ
        *ALUop = 1;
    } else if (opcode == OPCODE_BNE) { // 4
        *RegDst = 99;  
        *ALUSrc = 0; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 0; 
        *MemWrite = 1; 
        *Jump = 0; *Jal = 0;
        *Branch = 1; *BranchType = 0; // 0 = BNE
        *ALUop = 1;   
    } else if (opcode == OPCODE_SW) { // 43
        *RegDst = 99;  
        *ALUSrc = 1; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 0; 
        *MemWrite = 1; 
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0; 
    } else if (opcode == OPCODE_ADDI || opcode == OPCODE_ANDI || 
               opcode == OPCODE_ORI || opcode == OPCODE_XORI || 
               opcode == OPCODE_SLTI || opcode == OPCODE_SLTIU) {
        *RegDst = 0; 
        *ALUSrc = 1; 
        *MemtoReg = 0;
        *RegWrite = 1; 
        *MemRead = 0; 
        *MemWrite = 0; 
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0; // need to reconsidering
    } else if (opcode == OPCODE_J) {
        *RegDst = 0; 
        *ALUSrc = 0; 
        *MemtoReg = 0;
        *RegWrite = 0; 
        *MemRead = 0; 
        *MemWrite = 0; 
        *Jump = 1;  *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0; // need to reconsidering
    } else if (opcode == OPCODE_JAL) {
        *RegDst = 0; 
        *ALUSrc = 0; 
        *MemtoReg = 0;
        *RegWrite = 1; 
        *MemRead = 0; 
        *MemWrite = 0; 
        *Jump = 1; *Jal = 1;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0; // need to reconsidering
    } else if (opcode == OPCODE_BLEZ) {
        *RegDst = 99;  
        *ALUSrc = 0; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 0; 
        *MemWrite = 1; 
        *Jump = 0; *Jal = 0;
        *Branch = 1; *BranchType = 4; // 4 = BLEZ
        *ALUop = 1; 
    } else if (opcode == OPCODE_BGTZ) {
        *RegDst = 99;  
        *ALUSrc = 0; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 0; 
        *MemWrite = 1; 
        *Jump = 0; *Jal = 0;
        *Branch = 1; *BranchType = 5; // 4 = BLEZ
        *ALUop = 1; 
    } else if (opcode == OPCODE_SB) {
        *RegDst = 99;  
        *ALUSrc = 1; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 1; 
        *MemWrite = 1; *SpecialMemwrite = 1; 
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0;  
    } else if (opcode == OPCODE_SH) {
        *RegDst = 99;  
        *ALUSrc = 1; 
        *MemtoReg = 99;
        *RegWrite = 0; 
        *MemRead = 1; 
        *MemWrite = 1; *SpecialMemwrite = 2; 
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0;  
    } else if (opcode == OPCODE_LB ) {
        *RegDst = 0;  
        *ALUSrc = 1; 
        *MemtoReg = 1;
        *RegWrite = 1; 
        *MemRead = 1; 
        *MemWrite = 0; *SpecialMemwrite = 3;
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0;  
    } else if (opcode == OPCODE_LH) {
        *RegDst = 0;  
        *ALUSrc = 1; 
        *MemtoReg = 1;
        *RegWrite = 1; 
        *MemRead = 1; 
        *MemWrite = 0; *SpecialMemwrite = 4;
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0;  
    } else if (opcode == OPCODE_LBU) {
        *RegDst = 0;  
        *ALUSrc = 1; 
        *MemtoReg = 1;
        *RegWrite = 1; 
        *MemRead = 1; 
        *MemWrite = 0; *SpecialMemwrite = 5;
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0;  
    } else if (opcode == OPCODE_LHU) {
        *RegDst = 0;  
        *ALUSrc = 1; 
        *MemtoReg = 1;
        *RegWrite = 1; 
        *MemRead = 1; 
        *MemWrite = 0; *SpecialMemwrite = 6;
        *Jump = 0; *Jal = 0;
        *Branch = 0; *BranchType = 0;
        *ALUop = 0;  
    }
} 

void alu_ctrl(uint32_t inst, int ALUop, int *ALUctrlLine, int *JalrCtrl){
    uint32_t inst_operation;
    uint32_t opcode_operation; 
    uint32_t tempAluLine;
    inst_operation = get_bit_range(inst, 5, 0); 
    printf("ALUOP : %d\n", ALUop);
    if (ALUop == 2) {
        switch (inst_operation){
            case ADD_FUNC:  tempAluLine = ADD;  *JalrCtrl=0; break;
            case ADDU_FUNC: tempAluLine = ADD;  *JalrCtrl=0; break;
            case SUB_FUNC:  tempAluLine = SUB;  *JalrCtrl=0; break;
            case SUBU_FUNC: tempAluLine = SUBU; *JalrCtrl=0;  break;
            case AND_FUNC:  tempAluLine = AND;  *JalrCtrl=0; break;
            case NOR_FUNC:  tempAluLine = NOR;  *JalrCtrl=0; break;
            case OR_FUNC:   tempAluLine = OR;   *JalrCtrl=0; break;
            case SLL_FUNC:  tempAluLine = SLL;  *JalrCtrl=0; break;
            case SLLV_FUNC: tempAluLine = SLLV; *JalrCtrl=0; break;
            case SLT_FUNC:  tempAluLine = SLT;  *JalrCtrl=0; break;
            case SLTU_FUNC: tempAluLine = SLT;  *JalrCtrl=0; break;
            case SRA_FUNC:  tempAluLine = SRA;  *JalrCtrl=0; break;
            case SRAV_FUNC: tempAluLine = SRAV; *JalrCtrl=0; break;
            case SRL_FUNC:  tempAluLine = SRL;  *JalrCtrl=0;break;
            case SRLV_FUNC: tempAluLine = SRLV; *JalrCtrl=0; break;
            case XOR_FUNC:  tempAluLine = XOR;  *JalrCtrl=0;break;
            case SYSCALL: tempAluLine = ADD; *JalrCtrl=0; RUN_BIT = 0;  break;
            case JALR_FUNC: tempAluLine = ADD; *JalrCtrl=1; break;
            case MULT_FUNC: tempAluLine = MULT; *JalrCtrl=0; break;
            case MULTU_FUNC: tempAluLine = MULTU; *JalrCtrl=0; break;
            case DIV_FUNC: tempAluLine = MULT; *JalrCtrl=0; break;
            case DIVU_FUNC: tempAluLine = MULTU; *JalrCtrl=0; break;

            case MFHI_FUNC: tempAluLine = MFHI; *JalrCtrl=0; break;
            case MFLO_FUNC: tempAluLine = MFLO; *JalrCtrl=0; break;
            case MTHI_FUNC: tempAluLine = MTHI; *JalrCtrl=0; break;
            case MTLO_FUNC: tempAluLine = MTLO; *JalrCtrl=0; break;
        }
    } else if (ALUop == 1) { 
        printf("ALU sum \n"); 
        tempAluLine = SUB;
    } else if (ALUop == 0) {
        opcode_operation = get_bit_range(inst, 31, 26); 
        printf("opcode Opertation %d\n", opcode_operation); 
        switch (opcode_operation){
            case OPCODE_LUI:   tempAluLine = SHIFT_UPPER; break;
            case OPCODE_LW: tempAluLine = ADD; break; 
            case OPCODE_SW: tempAluLine = ADD; break;
            case OPCODE_ADDI: tempAluLine = ADD; break;
            case OPCODE_ANDI: tempAluLine = AND; break;
            case OPCODE_ORI: tempAluLine = OR; break;
            case OPCODE_XORI: tempAluLine = XOR; break;
            case OPCODE_SLTI:  tempAluLine = SLT;  break;
            case OPCODE_SLTIU: tempAluLine = SLT;  break;
            default: printf("error something\n"); break; 
        }
    }
    *ALUctrlLine = tempAluLine;
    printf("alu ctrl line : %d\n", *ALUctrlLine);
}

void alu(uint32_t a, uint32_t b, uint32_t *result, int shamt, int ALU_ctrl_val, int *Zero, int *Negative, uint32_t inst){
    printf("aluline : %d\n", ALU_ctrl_val);
    uint64_t mult_temp; 
    uint32_t div, mod; 
    uint32_t rd, rs; 
    rd = get_bit_range(inst, 15, 11); 
    rs = get_bit_range(inst, 25, 21); 
    switch (ALU_ctrl_val){
        // real ALU function
        case ADD:  *result = a + b; break;
        case SUB:  *result = ((signed)(a)) - ((signed)(b)); break;
        case SUBU:  *result = ((unsigned)(a)) - ((unsigned)(b)); break;
        case AND:  *result = a & b; break;
        case OR:   *result = a | b; break;
        case XOR:  *result = a ^ b; break;
        case SLL:  *result = ((signed)(b)) << (shamt & 0x1F); break;
        case SRL:  *result = ((unsigned)(b)) >> (shamt & 0x1F); break;
        case SRA:  *result = ((signed)(b)) >> (shamt & 0x1F); break;
        case SLT:  *result = ((signed)(a)) < ((signed)(b)); break;
        case NOR:  *result = ~(a | b); break;
        case SLLV: *result = ((signed)(b)) << (a & 0x1F); break;
        case SRLV: *result = ((unsigned)(b)) >> (a & 0x1F); break;
        case SRAV: *result = ((signed)(b))>> (a & 0x1F); break;
        case MULT: 
            mult_temp = (int64_t)a * (int64_t)b; 
            NEXT_STATE.HI = (mult_temp & 0xFFFFFFFF00000000) >> 32;
            NEXT_STATE.LO = (mult_temp & 0x00000000FFFFFFFF);
            break;
        case MULTU: 
            mult_temp = (uint64_t)a * (uint64_t)b; 
            NEXT_STATE.HI = (mult_temp & 0xFFFFFFFF00000000) >> 32;
            NEXT_STATE.LO = (mult_temp & 0x00000000FFFFFFFF);
        case DIV: 
            NEXT_STATE.HI = (int64_t)a / (int64_t)b; 
            NEXT_STATE.LO = (int64_t)a / (int64_t)b; 
            break;
        case DIVU: 
            NEXT_STATE.HI = (uint64_t)a / (uint64_t)b; 
            NEXT_STATE.LO = (uint64_t)a / (uint64_t)b; 
            break;
        case MFHI: 
            NEXT_STATE.REGS[rd] = NEXT_STATE.HI;
            break;
        case MFLO: 
            NEXT_STATE.REGS[rd] = NEXT_STATE.LO;
        case MTHI: 
            NEXT_STATE.HI = NEXT_STATE.REGS[rs];
            break;
        case MTLO: 
            NEXT_STATE.LO = NEXT_STATE.REGS[rs];
        // make up function 
        case SHIFT_UPPER:  *result = (int)b << 16;  break; 
    }
    printf("result %d\n", (signed)*result);
    *Zero = (*result==0) ? 1:0;
    *Negative = get_bit_range(*result, 31, 31); 
}

void register_operation_read(uint32_t rd_reg1, uint32_t rd_reg2, uint32_t wr_reg, 
                uint32_t wr_data, uint32_t *rd_data1, uint32_t *rd_data2, int RegWrite){
    // if (RegWrite == 1) { // write data to register
    //     NEXT_STATE.REGS[rd_reg2] = wr_data; 
    // } 
    *rd_data1 = CURRENT_STATE.REGS[rd_reg1];
    *rd_data2 = CURRENT_STATE.REGS[rd_reg2];     
       
}
void register_operation_write(uint32_t rd_reg1, uint32_t rd_reg2, uint32_t wr_reg, 
        uint32_t read_data, uint32_t *rd_data1, uint32_t *rd_data2, int RegWrite){
    if (RegWrite == 1) { // write data to register
        printf("Write data to register %d: %x\n", wr_reg, read_data);
        NEXT_STATE.REGS[wr_reg] = read_data; 
    } 
    // *rd_data1 = CURRENT_STATE.REGS[rd_reg1];
    // *rd_data2 = CURRENT_STATE.REGS[rd_reg2];     
       
}

void data_memory(uint32_t datamem_addr, uint32_t write_data, uint32_t *read_data, int MemWrite, int MemRead, int SpecialMemwrite){
    uint32_t temp_read_data; 
    uint32_t byte;
    uint32_t mem;

    if (MemRead) {
        printf("Memread Test %x\n", datamem_addr);
        temp_read_data = mem_read_32(datamem_addr);
        *read_data = temp_read_data; 
        if (SpecialMemwrite == 3) { // LB
            *read_data = temp_read_data & 0x000000FF; 
            *read_data = sign_extend(get_bit_range(*read_data, 15, 0), 8); 
        } else if (SpecialMemwrite == 4) { // LH
            *read_data = temp_read_data & 0x0000FFFF; 
            *read_data = sign_extend(get_bit_range(*read_data, 15, 0), 16); 
        } else if (SpecialMemwrite == 5) { // LBU
            *read_data = temp_read_data & 0x000000FF; 
        } else if (SpecialMemwrite == 6) { // LHU
            *read_data = temp_read_data & 0x0000FFFF; 
        }
    }
    printf("temp_read_data : %x: %x\n", temp_read_data, write_data);
    if (MemWrite) { 
        if (SpecialMemwrite == 1) { // SB
            byte = write_data & 0x000000FF;
            mem = temp_read_data & 0xFFFFFF00; 
            printf("mem byte: %x: %x\n", mem, byte);
            write_data = mem + byte; 
        } else  if (SpecialMemwrite == 2){ // SH
            byte = write_data & 0x0000FFFF;
            mem = temp_read_data & 0xFFFF0000; 
            printf("mem byte: %x: %x\n", mem, byte);
            write_data = mem + byte; 
        }
        printf("Memwrite Test %x %x\n", datamem_addr, write_data);
        mem_write_32(datamem_addr, write_data); 
    }
    
}



void process_instruction()
{
    /* execute one instruction here. You should use CURRENT_STATE and modify
     * values in NEXT_STATE. You can call mem_read_32() and mem_write_32() to
     * access memory. */

    // declare datapath variable
    uint32_t current_pc; 
    uint32_t inst; 
    uint32_t rd_reg1; 
    uint32_t rd_reg2;
    uint32_t wr_reg; 
    uint32_t wr_data;
    uint32_t rd_data1; 
    uint32_t rd_data2; 
    uint32_t alu_in_1; 
    uint32_t alu_in_2; 
    uint32_t alu_out;
    uint32_t datamem_addr;
    uint32_t write_data; 
    uint32_t read_data; 
    uint32_t shamt;
    uint32_t wr_reg2; 
    uint32_t wr_reg3; 

    // declare control variable
    int ALU_ctrl; 
    int RegWrite; 
    int MemWrite; 
    int MemRead; 
    int Jal;
    int RegDst; 
    int MemtoReg;
    int Jump; 
    int Branch; 
    int ALUop; 
    int ALUSrc; 
    int ALUctrlLine; 
    int Zero; 
    int BranchType; 
    int Negative; 
    int JalrCtrl;
    int Jalr;
    int SpecialMemwrite; 

    // declare temp variable
    int32_t signedExtended32; 
    uint32_t jump_addr;
    uint32_t tempPC_1;
    uint32_t inst25_0; 
    uint32_t inst27_0;
    uint32_t upper4bitsCurrentPC;  
    uint32_t aluPCresult; 
    uint32_t aluPCresult2; 
    uint32_t nextstatePC; 

    // Instruction Memory 
    current_pc = CURRENT_STATE.PC; 
    instuction_memory(current_pc, &inst); 
    printf("current pc : %x\n", current_pc); 
    printf("instuction : %x\n", inst); 

    // // Control Block
    ctrl(inst, &RegDst, &Jump, &Branch, &MemRead, &Jal, &MemtoReg, &ALUop, &MemWrite, &ALUSrc, &RegWrite, &BranchType, &Jalr, &SpecialMemwrite); 
    alu_ctrl(inst, ALUop, &ALUctrlLine, &JalrCtrl); 

    // // Read Registers
    rd_reg1 = get_bit_range(inst, 25, 21);  // rs
    rd_reg2 = get_bit_range(inst, 20, 16);  // rt
    wr_reg = get_bit_range(inst, 15, 11);  // rd
    shamt = get_bit_range(inst, 10, 6);  // shamt
    wr_reg = (RegDst == 1) ? get_bit_range(inst, 15, 11): rd_reg2; 
    
    register_operation_read(rd_reg1, rd_reg2, wr_reg, wr_data, &rd_data1, &rd_data2, RegWrite);
    printf("rd_reg1 %d\n", rd_reg1); 
    printf("rd_reg2 %d\n", rd_reg2); 
    printf("wr_reg   %d\n", wr_reg); 
    printf("rd_data1 %x\n", rd_data1); 
    printf("rd_data2 %x\n", rd_data2); 

     
    tempPC_1 = current_pc + 4; 
    inst25_0 = get_bit_range(inst, 25, 0); // 26 bit 
    inst27_0 = inst25_0 << 2; // 28 bit
    printf("inst27_0 %x\n", inst27_0); 
    upper4bitsCurrentPC = get_bit_range(current_pc, 31, 28); 
    jump_addr = (upper4bitsCurrentPC << 28)+(inst27_0); 
    printf("jump addr %x\n", jump_addr); 


    // // ALU
    alu_in_1 = rd_data1; 
    signedExtended32 = sign_extend(get_bit_range(inst, 15, 0), 16); 
    printf("signedExtended32 %d\n", signedExtended32);
    alu_in_2 = (ALUSrc == 1) ? signedExtended32 : rd_data2; 
    printf("alu_in_2 %d\n", alu_in_2);
    alu(alu_in_1, alu_in_2, &alu_out, shamt, ALUctrlLine, &Zero, &Negative, inst); 
    printf("Flag N,Z %d,%d\n", Negative, Zero);
    // NEXT_STATE.REGS[wr_reg] = alu_out; // write register back to register files
    
    aluPCresult = (signedExtended32 << 2) + tempPC_1; 
    int condALU, condNotEq, condBgez, condBltz, condBlez, condBgtz; 
    if (BranchType == 1) { // 1 = beq
        condALU = (Zero == 1) && (Branch == 1); 
        aluPCresult2 = (condALU==1)? aluPCresult-4:tempPC_1; 
    } else if (BranchType == 0){ // 0 = bne
        condNotEq = (Zero == 0) && (Branch == 1);
        aluPCresult2 = (condNotEq==1)? aluPCresult-4:tempPC_1; 
    } else if (BranchType == 2) { // 2 = bgez bgezal
        condBgez = (Negative == 0) & (Branch == 1);
        aluPCresult2 = (condBgez==1)? aluPCresult-4:tempPC_1; 
    } else if (BranchType == 3) { // 3 = bltz bltzal
        condBltz = (Negative == 1) & (Branch == 1);
        aluPCresult2 = (condBltz==1)? aluPCresult-4:tempPC_1; 
    } else if (BranchType == 4) { // 4 = BLEZ
        condBlez = ((Negative == 1) || (Zero == 1))& (Branch == 1);
        aluPCresult2 = (condBlez==1)? aluPCresult-4:tempPC_1;  
    }  else if (BranchType == 5) { // 5 = BGTZ
        condBgtz = ((Negative == 0) && (Zero == 0))& (Branch == 1);
        aluPCresult2 = (condBgtz==1)? aluPCresult-4:tempPC_1;  
    }

    nextstatePC = (Jump==1)? jump_addr: aluPCresult2; 

    printf("ALUOUT %d\n", alu_out); 
    // WriteBack
    datamem_addr = alu_out; 
    write_data = rd_data2; 
    data_memory(datamem_addr, write_data, &read_data, MemWrite, MemRead, SpecialMemwrite); 
    read_data = (MemtoReg==1)? read_data: alu_out;
    printf("read_data wb: %d\n", read_data);
    read_data = (Jal==1)? tempPC_1+4: read_data; 
    wr_reg2 = (Jal==1)? 31: wr_reg; 
    wr_reg3 = (Jalr ==1)? wr_reg:wr_reg2; 
    printf("wr_reg_2 %d %d: %x\n", RegWrite, wr_reg, read_data); 
    register_operation_write(rd_reg1, rd_reg2, wr_reg, read_data, &rd_data1, &rd_data2, RegWrite);
    // NEXT_STATE.REGS[rd_reg2] = read_data; 
    nextstatePC = (JalrCtrl==1)? rd_data1:nextstatePC;
    printf("nextstatePC %x\n", nextstatePC); 
    NEXT_STATE.PC = nextstatePC; 
    // wr_data = (MemtoReg == 1) ? read_data: alu_out; // need to reconsider

}









