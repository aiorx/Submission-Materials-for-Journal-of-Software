```python
def create_dataloader(mode):
    if mode == 'train':
        return DataLoader(
            dataset=Wave_Dataset(mode),
            batch_size=cfg.batch,  # max 3696 * snr types
            shuffle=True,
            num_workers=0,
            pin_memory=True,
            drop_last=True,
            sampler=None
        )
    elif mode == 'valid':
        return DataLoader(
            dataset=Wave_Dataset(mode),
            batch_size=cfg.batch, shuffle=False, num_workers=0
        )    # max 1152
```