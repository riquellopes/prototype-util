MaskMoney = Class.create({
	input:null,
	options:{
		focus:null,
		keydown:null,
		max_tam:10
	},

	/***
	 * Teclas permitidas::
	 */
	numeric_keys:
	{
		8:'',48:'',49:'',50:'',51:'',52:'',53:'',54:'',55:'',56:'',57:'',
		96:'',97:'',98:'',99:'',100:'',101:'',102:'',103:'',104:'',105:''
	},

	clean_keys:
	{
	  	37:'',39:'',46:''
	},

	initialize:function(input, options)
	{
		this.input = $(input);
		this.input.observe('keydown', this.mask.bind(this));

		Object.extend( this.options, options );
		Object.extend( this.numeric_keys, this.clean_keys );

		if( typeof this.options.focus == 'function' )
		{
			this.input.observe('focus', this.options.focus.bind( this.input ));
		}//if

		if( typeof this.options.keydown == 'function' )
		{
			this.input.observe('keydown', this.options.keydown.bind( this.input ));
		}//if
	},

	mask:function(e)
	{
		var key = (e.charCode||e.KeyCode||e.which);

		/**
		 * Bloqueia teclas não desejadas e não executa nenhum código::
		 */
		 	if( !(key in this.numeric_keys) ) 
		 	{ 
		 		e.stop(); return ;
		 	}//if

		 	/***
		 	 * Permite que o usuário digite um número, mais
		 	 * bloqueia a excução do código::
		 	 */
				if( key in this.clean_keys )
					return ;

		var value = (this.input.value).replace(/[^0-9]/g, ''),
			tam = (value.length);

		/***
		 * Caso usuário digite um número, 
		 * é adicionado +1 ao seu tamanho::
		 */
		if( tam < this.options.max_tam && key != 8 )
			tam = (tam + 1);

		/***
		  * Caso usuário limpe o campo::
		  */
		else if (key == 8 ) 
		{ 
			tam = (tam - 1); 
		}//if
		  

	   /***
	    * Formata moeda::
	    */
	       if ( tam <= 2 )
	       {
    			this.input.value = value;
           }

		   if ( (tam > 2) && (tam <= 5) )
		   {
		    	this.input.value = value.substr( 0, tam - 2 ) + ',' + value.substr( tam - 2, tam );
		   }

		   if ( (tam >= 6) && (tam <= 8) )
		   {
		    	this.input.value = value.substr( 0, tam - 5 ) + '.' + value.substr( tam - 5, 3 ) + ',' + value.substr( tam - 2, tam ) ; 
		   }

		   if ( (tam >= 9) && (tam <= 11) )
		   {
		    	this.input.value = value.substr( 0, tam - 8 ) + '.' + value.substr( tam - 8, 3 ) + '.' + value.substr( tam - 5, 3 ) + ',' + value.substr( tam - 2, tam ) ; 
		   }

		   if ( (tam >= 12) && (tam <= 14) )
		   {
		    	this.input.value = value.substr( 0, tam - 11 ) + '.' + value.substr( tam - 11, 3 ) + '.' + value.substr( tam - 8, 3 ) + '.' + value.substr( tam - 5, 3 ) + ',' + value.substr( tam - 2, tam ) ; 
		   }

		   if ( (tam >= 15) && (tam <= 17) )
		   {
		    	this.input.value = value.substr( 0, tam - 14 ) + '.' + value.substr( tam - 14, 3 ) + '.' + value.substr( tam - 11, 3 ) + '.' + value.substr( tam - 8, 3 ) + '.' + value.substr( tam - 5, 3 ) + ',' + value.substr( tam - 2, tam ) ;
		   }

	}
});