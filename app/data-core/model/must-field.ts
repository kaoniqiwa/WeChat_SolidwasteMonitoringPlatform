 
export class FormMustField{
    resource = [
        'Name','ResourceType','Id'
    ];
    encodeDevice = [
        'Name','ResourceType', 'Url','Id'
    ];
    camera=[
        'CameraType','CameraState','ChannelNo','EncodeDeviceId','Id'
    ];

    region = ['Id','Name','IsLeaf','RegionType'];
    
    platform =['Id','ProtocolType','Url','State','EventCodes'];

    srServer  = ['Id','Name','ProtocolType','Addresses'];
  
    division =['Id','Name','IsLeaf','DivisionType'];

    garbageStation=['Id','Name','StationType','MaxDryVolume','MaxWetVolume'];

    garbageStationType=['Type','Name','No','CanType','CameraUsage'];

    cameraAIModel=['Id','ModelJSON'];
}