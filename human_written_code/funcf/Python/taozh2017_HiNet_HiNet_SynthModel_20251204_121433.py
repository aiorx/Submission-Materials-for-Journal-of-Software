```python
def train(self):   
        
    if not os.path.isdir(self.opt.save_path+'/'+'task_'+str(self.opt.task_id)+'/'):
        mkdir_p(self.opt.save_path+'/'+'task_'+str(self.opt.task_id)+'/')
    
    logger = Logger(os.path.join(self.opt.save_path+'/'+'task_'+str(self.opt.task_id)+'/'+'run_log.txt'), title='')
    logger.set_names(['Run epoch', 'D Loss', 'G Loss'])

    #
    self.generator.apply(weights_init_normal)
    self.discrimator.apply(weights_init_normal)
    print('weights_init_normal')
            
    # Optimizers
    optimizer_D     = torch.optim.Adam(self.discrimator.parameters(), lr=self.opt.lr,betas=(self.opt.b1, self.opt.b2))
    optimizer_G     = torch.optim.Adam(self.generator.parameters(),lr=self.opt.lr,betas=(self.opt.b1, self.opt.b2))

    # Learning rate update schedulers
    lr_scheduler_G  = torch.optim.lr_scheduler.LambdaLR(optimizer_G, lr_lambda=LambdaLR(self.opt.epochs, 0, self.opt.decay_epoch).step)
    lr_scheduler_D  = torch.optim.lr_scheduler.LambdaLR(optimizer_D, lr_lambda=LambdaLR(self.opt.epochs, 0, self.opt.decay_epoch).step)

        
    # Lossesgenerator
    criterion_GAN   = nn.MSELoss().cuda()
    criterion_identity = nn.L1Loss().cuda()

    # Load data        
    train_data   = MultiModalityData_load(self.opt,train=True)
    train_loader = DataLoader(train_data,batch_size=self.opt.batch_size,shuffle=False)


    batches_done = 0
    prev_time    = time.time()
    # ---------------------------- *training * ---------------------------------
    for epoch in range(self.opt.epochs):      
        for ii, inputs in enumerate(train_loader):
            print(ii)
            
            # define diferent synthesis tasks
            [x1,x2,x3] = model_task(inputs,self.opt.task_id) # train different synthesis task
            
            fake  = torch.zeros([inputs[0].shape[1]*inputs[0].shape[0],1,6,6], requires_grad=False) #.cuda()
            valid = torch.ones([inputs[0].shape[1]*inputs[0].shape[0],1,6,6], requires_grad=False)#.cuda()
                          
            ###############################################################                     
            if self.opt.use_gpu:
                valid = valid.cuda()
                fake  = fake.cuda()
                x1    = x1.cuda()
                x2    = x2.cuda()
                x3    = x3.cuda()
                
            # ---------------------
            #  Train Discriminator
            # ---------------------
            optimizer_D.zero_grad()
            
            # Real loss
            pred_real = self.discrimator(x3)
            loss_real = criterion_GAN(pred_real, valid)
            
            # Fake loss
            gen_fake = self.generator(x1,x2)
            pred_fake = self.discrimator(gen_fake.detach())
            loss_fake = criterion_GAN(pred_fake, fake)
            
            # Total loss
            loss_D = (loss_real + loss_fake) / 2
            
            loss_D.backward()
            optimizer_D.step()
            
            # -----------------
            #  Train Generator
            # -----------------
            optimizer_G.zero_grad()
            
            # Identity loss
            loss_identity = criterion_identity(gen_fake, x3)
            
            # GAN loss
            pred_fake = self.discrimator(gen_fake)
            loss_GAN = criterion_GAN(pred_fake, valid)
            
            # Total loss
            loss_G = loss_GAN + 100 * loss_identity
            
            loss_G.backward()
            optimizer_G.step()
            
            # --------------
            #  Log Progress
            # --------------
            batches_done += 1
            batches_left = self.opt.epochs * len(train_loader) - batches_done
            time_left = datetime.timedelta(seconds=batches_left * (time.time() - prev_time))
            prev_time = time.time()
            
            print(
                "\r[Epoch %d/%d] [Batch %d/%d] [D loss: %f] [G loss: %f] ETA: %s"
                % (epoch, self.opt.epochs, ii, len(train_loader), loss_D.item(), loss_G.item(), time_left)
            )
            
            logger.append([epoch, loss_D.item(), loss_G.item()])
        
        lr_scheduler_G.step()
        lr_scheduler_D.step()
        
    logger.close()
```