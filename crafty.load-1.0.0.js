define(['crafty'], 

function(){

	Crafty.load = function (data, oncomplete, onprogress, onerror) {
	            
	    var i = 0, l = data.length, current, obj, total = l, j = 0, ext = "" ;
	  
	        //Progress function
	    function pro(){
	        var src = this.src;
	       var subtotal = (Crafty.support.prefix == "ms") ? total * 2 : total;
	        //Remove events cause audio trigger this event more than once(depends on browser)
	        if (this.removeEventListener) {  
	            this.removeEventListener('canplaythrough', pro, false);     
	        }
	       
	        ++j;
	        //if progress callback, give information of assets loaded, total and percent
	        if (onprogress) 
	            onprogress({
	                loaded: j, 
	                total: total, 
	                percent: (j / subtotal * 100),
	                src:src
	            });
				
	        if(j === subtotal && oncomplete) oncomplete();
	    };
	    //Error function
	    function err(){
	        var src = this.src;
		var subtotal = (Crafty.support.prefix == "ms") ? total * 2 : total; 	
	        if (onerror) 
	            onerror({
	                loaded: j, 
	                total: total, 
	                percent: (j / subtotal * 100),
	                src:src
	            });
	       		
	        j++;
	
			        if (onprogress) 
	            onprogress({
	                loaded: j, 
	                total: total, 
	                percent: (j / subtotal * 100),
	                src:src
	            });
	
	        if(j === subtotal && oncomplete) oncomplete();
	    };
	       
	    for (; i < l; ++i) {       
	        current = data[i];
	        ext = current.substr(current.lastIndexOf('.') + 1, 3).toLowerCase();
	       
	        obj = Crafty.asset(current) || null;   
	      
	        if (Crafty.support.audio && Crafty.audio.supported[ext]) {   
	            //Create new object if not exists
	            if(!obj){
	                var name = current.substr(current.lastIndexOf('/') + 1).toLowerCase();
	                obj = Crafty.audio.audioElement();
	                obj.id = name;
	                obj.src = current;
	                obj.preload = "auto";
	                obj.volume = Crafty.audio.volume;
	                Crafty.asset(current, obj);
	                Crafty.audio.sounds[name] = {
	                    obj:obj,
	                    played:0
	                } 
	            }
	    
	            //addEventListener is supported on IE9 , Audio as well
	            if (obj.addEventListener) {  
	                obj.addEventListener('canplaythrough', pro, false);     
	            }s
	               
	             
	        } else if (Crafty.image_whitelist.indexOf(ext) >= 0) { 
	            if(!obj) {
	                obj = new Image();
	                Crafty.asset(current, obj);   
	            }

	            	 obj.src = "";
	            obj.onload=pro;
	            // workaround for webkit bug
	            obj.src = current; //setup src after onload function Opera/IE Bug
	         
	        } else {
	            total--;
	            continue; //skip if not applicable
	        }
	        obj.onerror = err;
	    }
	   
	};

});