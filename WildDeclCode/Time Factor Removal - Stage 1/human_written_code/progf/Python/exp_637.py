from abc import ABC, abstractmethod
from io import StringIO
from typing import List


from pymjc.front import temp


class Targets():

  def __init__(self, labels):
    self.labels = labels

class Instr(ABC):

    @abstractmethod
    def use(self) :
        pass

    @abstractmethod
    def deff(self) :
        pass

    @abstractmethod
    def jumps(self) :
        pass

    def nth_temp(self, temp_list, i) :
        if i == 0:
            return temp_list.head
        else:
            return self.nth_temp(temp_list.tail, i - 1)
  

    def nth_label(self, label_list, i) :
        if i == 0:
            return label_list.head
        else:
            return self.nth_label(label_list.tail, i - 1)


    def format(self, temp_map) :
        dest = self.deff()
        src = self.use()
        j = self.jumps()
        jump = None
        if j is not None:
            jump = j.labels

        s = StringIO()
        length = len(self.assem)
        pass

        for i in range(length):
            if (self.assem[i] == '`'):
                i += 1
                match(self.assem[i]):
                    case 's':
                        i += 1
                        n = int(self.assem[i], 10)
                        t = self.nth_temp(src, n)
                        result = temp_map.temp_map(t)
                        if result is not None:
                            s.write(temp_map.temp_map(t))
                        else:
                            s.write(t)

                    case 'd':
                        i += 1
                        n = int(self.assem[i], 10)
                        t = self.nth_temp(dest, n)
                        result = temp_map.temp_map(t)
                        if result is not None:
                            s.write(temp_map.temp_map(t))
                        else:
                            s.write(t)

                    case 'j':
                        i += 1
                        n = int(self.assem[i], 10)
                        s.write(self.nth_label(jump, t).to_string())

                    case '`':
                        s.write('`')

                    case _:
                        raise RuntimeError("bad Assem format")
            else:
                s.write(self.assem[i])

        return s.getvalue()



class InstrList():
    def __init__(self, head, tail):
        self.head = head
        self.tail = tail
    
    def to_list(self) :
        instr_list = List[Instr]
        current_head = self.head
        current_tail = self.tail
        while current_head is not None:
            instr_list.append(current_head)
            if current_tail is not None:
                current_head = current_tail.head
                current_tail = current_tail.tail
            else:
                current_head = None
        return instr_list


class LABEL(Instr):
   def __init__(self, assem, label):
      self.assem = assem
      self.label = label

   def use(self) :
      return None

   def deff(self) :
      return None

   def jumps(self) :
      return None



class MOVE(Instr):
   def __init__(self, assem, dest, src):
      self.assem = assem
      self.dest = dest
      self.src = src 

   def use(self) :
      return temp.TempList(self.src, None)

   def deff(self) :
      return temp.TempList(self.dest, None)

   def jumps(self) :
      return None


class OPER(Instr):
    def __init__(self, assem, dest, src, j = None):
       self.assem = assem
       self.dest = dest
       self.src = src
       
       if j is not None:
           self.jump = Targets(j)
       else:
           self.jump = None 
    
    def use(self) :
        return self.src

    def deff(self) :
        return self.dest

    def jumps(self) :
        return self.jump