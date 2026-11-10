int First7(int *a,int n,int i){
	if(i==n){
		return -1;
	}

	if(a[i]==7){
		return i;
	}
	return First7(a,n,i+1);
	// int BaakiArrayMei7KaIndex = First7(a,n,i+1);
	// return BaakiArrayMei7KaIndex;
}