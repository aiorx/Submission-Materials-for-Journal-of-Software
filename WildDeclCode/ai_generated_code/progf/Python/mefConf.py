# funMefVef.py
# $language = "python"
# $interface = "1.0"

from re import I
import sys
import time
import os
import basic.basicConf as bc

###### Element Function  ######

### Create maximum numberof VLAN  ###	  
def crtVlan(sub_child,vlans):
    if vlans == 1:
        return
    else: 
        sub_child.send_config_set("vlan 2-%s" % str(vlans))


### Create EVC and Add SVLAN ###	   
def crtSvc(sub_child,svc):
    for i in range (1,svc+1,1):
        createService = [
            "ethernet service add evc" + str(i),
            "svlan " + str(i),
            "service type evpl"
            ]
        sub_child.send_config_set (createService)
        time.sleep(0.2)


### Create NNI and add Service ###  
def crtNni(sub_child, svc, nni):
    config_set = [
        "ethernet nni add nni1",
        "map interface " + str(nni),
        *[f"add service evc{i}" for i in range(1, svc+1)],
        ]
    sub_child.send_config_set(config_set)
    time.sleep(0.2)

### Create UNI ###  
def crtUni(sub_child,uni):
        for i in range (1, uni+1, 1):
            createUni = [
                "ethernet uni add uni" + str(i),
                "map interface 1/" + str(i),
                "all-to-one-bundling disable",
                "multiplex enable",
                "bundling enable",
                "max-svc 256"
                ]
            sub_child.send_config_set(createUni)
            time.sleep(0.2)


## Add Service to UNI### 
def addSvc(sub_child, svc, uni):
    sep, sep_reminder = divmod(svc, uni)
    for uni_index in range(1, uni+1):
        svc_cmds = [f"add service evc{i}" for i in range(uni_index * sep - sep + 1, uni_index * sep + 1)]
        if uni_index == uni and sep_reminder != 0:
            svc_cmds += [f"add service evc{i}" for i in range(sep * uni_index + 1, sep * uni_index + sep_reminder + 1)]
        cmd_list = [f"ethernet uni uni{uni_index}"] + svc_cmds  # ** Add List to List**
        sub_child.send_config_set(cmd_list)
        time.sleep(0.2)

#### Add CE-VLAN into SEP ### -- Code Drafted using common development resources --
def addCvlan(sub_child, svc, uni):
    sep, sep_remainder = divmod(svc, uni)
    cVlan, cVlan_remainder = divmod(4095, svc)
    for uni_index in range(1, uni+1):
        config_set = []
        for svc_index in range(uni_index * sep - sep + 1, uni_index * sep + 1): # Number of EVC per UNI 
            cvlan_cmd = f"ethernet sep uni{uni_index}-evc{svc_index}" 
            start_vlan = svc_index * cVlan - cVlan + 1                          # Start CE-VLAN Number per EVC 
            end_vlan = svc_index * cVlan                                        # End CE-VLAN Number per EVC 
            vlan_cmd = f"add vlan {start_vlan}-{end_vlan}"
            config_set += [cvlan_cmd, vlan_cmd]        # *** Add commands to the list so they can run sequentially ***
        
        if uni_index == uni and sep_remainder != 0:
            for svc_index in range(sep * uni_index + 1, sep * uni_index + sep_remainder + 1):
                if svc_index == svc and cVlan_remainder != 0:
                    cvlan_cmd = f"ethernet sep uni{uni_index}-evc{sep * uni_index + sep_remainder + 1}"
                    start_vlan = (sep * uni_index + sep_remainder + 1) * cVlan - cVlan + 1
                    end_vlan = start_vlan + cVlan_remainder - 1
                    vlan_cmd = f"add vlan {start_vlan-cVlan}-{end_vlan}"
                    config_set += [cvlan_cmd, vlan_cmd]
                else:
                    cvlan_cmd = f"ethernet sep uni{uni_index}-evc{svc_index}"
                    start_vlan = svc_index * cVlan - cVlan + 1
                    end_vlan = svc_index * cVlan
                    vlan_cmd = f"add vlan {start_vlan}-{end_vlan}"
                    config_set += [cvlan_cmd, vlan_cmd]                           
            
        sub_child.send_config_set(config_set)
        time.sleep(0.2)

#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'

### Delet maximum numberof VLAN  ###	  

### Delet VLAN  ###	
def dltVlan(sub_child,vlans):
    sub_child.send_config_set("no vlan 2-%s" % (vlans))    
    time.sleep(1) 


### Delete UNI and del Service ### 
def dltSvcUni(sub_child, svc, uni):
    sep, sep_reminder = divmod(svc, uni)
    for uni_index in range(1, uni+1):
        svc_cmds = [f"del service evc{i}" for i in range(uni_index * sep - sep + 1, uni_index * sep + 1)]
        if uni_index == uni and sep_reminder != 0:
            svc_cmds += [f"del service evc{i}" for i in range(sep * uni_index + 1, sep * uni_index + sep_reminder + 1)]
        cmd_list = [f"ethernet uni uni{uni_index}"] + svc_cmds + ["no map interface", f"ethernet uni del uni{uni_index}"]
        sub_child.send_config_set(cmd_list)
        time.sleep(0.2)

### Delete Service and NNI ###   
def dltNni(sub_child, svc):
    config_set = [
        "ethernet nni nni1",
        *[f"del service evc{i}" for i in range(1, svc+1)],
        "ethernet nni del nni1",
    ]
    sub_child.send_config_set(config_set)
    time.sleep(0.2)

def dltSvc(sub_child,svc):
    config_set = [*[f"ethernet service del evc{i}" for i in range(1, svc+1)], "time sleep 0.2"]
    sub_child.send_config_set(config_set)
    time.sleep(0.2)


#+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++!

def crtServi(host,svc,uni,nni):
    with bc.connect(host) as sub_child:  
        #Create SVLAN
        crtVlan(sub_child,svc)
        time.sleep(1)
        #Create EVC and Add SVLAN
        crtSvc(sub_child,svc)
        time.sleep(1)
        #Create NNI and add Service
        crtNni(sub_child,svc,nni)
        time.sleep(1)
        #Create UNI and add Service
        crtUni(sub_child,uni)
        time.sleep(1)
        #Add Service into UNI### 
        addSvc(sub_child,svc,uni)   
        time.sleep(1)
        #Add CE-VLAN into SEP### 
        addCvlan(sub_child,svc,uni)

### Delete Service ### 
def dltServi(host,svc,uni): 
    with bc.connect(host) as sub_child:  
        #Delete UNI and del Service
        dltSvcUni(sub_child,svc,uni)
        time.sleep(1)
        #Delete Service and NNI 
        dltNni(sub_child,svc)
        time.sleep(1)
        #Delete Service
        dltSvc(sub_child,svc)
        time.sleep(1)
        #Delete SVLAN
        dltVlan(sub_child,svc)
        time.sleep(1)

