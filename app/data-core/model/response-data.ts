

export class ResponseData{    
    

    static create<T extends ResponseData>(entity:new ()=> T):T{
        return new entity();
    }


    from(newObject:any)
    {
        return ResponseData.from(this, newObject);
    }

    static from<T extends ResponseData>(source:T, newSource:{new ():T})
    {

		let newObject = new newSource();
        if(null == source)
        {
            return source;
        }
        
        let isArray = false;        
        if(Array.isArray(source))
        {
            newObject = [];
            isArray = true;
        }
        
	    for (let key of Object.keys(source))
	    {
	        if(null == source[key])
	        {
	            if (isArray)
	            {
	                newObject.push(null);
	            }
	            else
	            {
	                newObject[key] = null;
	            }
	        }
	        else
	        {
	            let sub = (typeof source[key] == 'object') ? this.from(source[key], source[key]) : source[key];
	            if(isArray)
	            {
	                newObject.push(sub);
	            }
	            else
	            {
                    
	                newObject[key] = source[key];
	            }
	        }
	    }
	    return newObject;
    }
}