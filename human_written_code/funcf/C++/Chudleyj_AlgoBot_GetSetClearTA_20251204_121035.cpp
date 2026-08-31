```cpp
void TechnicalAnalysis::accessSignal(boost::optional<std::vector<double>&> copy,
                                     boost::optional<double> temp)
{
  std::lock_guard<std::mutex> guard(mtx);

  if(temp)
    setSignal(*temp);
  else if(copy)
    getSignal(*copy);
}
```