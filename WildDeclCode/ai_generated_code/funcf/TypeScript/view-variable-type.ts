/**
   * Get the complement of all variable types
   * This function is Written with routine coding tools
   * @param inputTypes
   */
  export function getComplement(inputTypes: ViewVariableType[]) {
    const allTypes: ViewVariableType[] = [
      ...BASE_ARRAY_PAIR.map(_pair => _pair[0]),
      ...BASE_ARRAY_PAIR.map(_pair => _pair[1]),
    ];

    return allTypes.filter(type => !inputTypes.includes(type));
  }