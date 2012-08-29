/****
 * 
 *	new FormOption("form-option-id", {
 *          @Define quais os options devem aparecer:
 *				ops:[ {label:'Henrique', value:15}, {label:'Carol', value:20, selected:true}, ],
 *
 *			@Call back é chamado quando um option sofre um click, ou quando eu defino o atributo selected:
 *			action:function(object){}
 *
 *		});
 *
 */
FormOption = Class.create({
	op:null,
	option_selected:null,
	options:{
		ops:null,
		action:null,
		label:"",
		duration:1
	},
	initialize:function(op, options)
	{
		this.op = $(op);
		Object.extend( this.options, options );
		
		/***
		 * Seta informações::
		 */
		 	this.setOptions();
	},
	
	/***
	 * @Seta informações::
	 */
	setOptions:function()
	{
		var li = new Array(),
			
			/***
			 * Label select::
			 */
			label = ('<label id=\'label-ID\' class=\'form-options cinza georgia aLeft\'>LABEL_MSG</label>'.replace(/ID/, this.op.id)).replace(/LABEL_MSG/, this.options.label),
			
			/***
			 * Template options::
			 */
			html = 'TAG_LABEL<a><span class=\'aLeft\' id=\'filter-valor\'>MSG_DEFAULT</span><div class=\'select-setinha aRight\' id=\'arrow\' open=\'false\'></div></a>'.replace(/TAG_LABEL/, this.options.label ? label : '')
			
			/***
			 * Template Ul::
			 */		
			ul = '<ul style=\'display:none;\' id=\'ID-options\'>TAGS_LI</ul>'.replace(/ID/, this.op.id),
			
			/***
			 * Lista de options::
			 */
			opts = (this.options.ops),
			
			$this = this;
			
			try
			{
				opts.each(function(item){
					var selected = "",
						value = item.value,
						display = "";
						
					if( item.selected && $this.option_selected == null )
					{
						selected = "selected='selected'";
						$this.option_selected = item;
						display = "display:none;"
					}//if
						
					li.push( "<li value='"+item.value+"' "+selected+" style='cursor:pointer;"+display+"' id='op-"+value+"'><a>"+item.label+"</a></li>" );		
				});
				
				this.op.update( 
							html.replace(/MSG_DEFAULT/, ($this.option_selected ? $this.option_selected.label : "") ).concat( ul.replace(/TAGS_LI/, li.join("") ) ) 
					).addClassName("form-options");
				
				/***
				 * Add Eventos::
				 */
				 	$("arrow").observe("click", $this.arrow_click.bind( $this ));
					$(document).observe("click", $this.close_options.bind( $this ));
							  
				 	$$("#"+this.op.id+" ul li").each(function(item){
						 $(item).observe("click", $this.click_on_option.bind( $this ));
				  	});
				
				/***
				 * Caso usuário defina que um option deve aparecer selecionado
				 * e exista um action ele é invocado.
				 */ 	
				  	if( $this.option_selected && ( typeof this.options.action == 'function' ) )
					{
						this.options.action.call($this.option_selected);
				 	}//if
					
			}catch(error){ /**/ }
	},
	
	/*** 
	 * @Abre e fecha select::
     */
	arrow_click:function()
	{
		var ul = ( $$("#"+this.op.id+" > ul").first().id ),
			duration = this.options.duration;
		
		$("arrow").setAttribute("open", ($("arrow").readAttribute("open") == 'false' ? 'true' : 'false') );
		Effect.toggle(ul, 'blind', {duration:duration});
	},
	
	/***
	 * @Option selecionado::
	 */
	click_on_option:function(e)
	{
		var el = Event.element(e),
			op = el.up(),
			ul = $$("#"+this.op.id+" > ul").first().id,
			
			/**
			 * Informações sobre option::
			 */
				label = el.innerHTML,
				id = $(op).readAttribute("value");
		
		Effect.toggle(ul, 'blind', {duration:this.options.duration});
		new Effect.Highlight("filter-valor", { startcolor: '#ffff99', endcolor: '#ffffff' });
		
		$("arrow").setAttribute("open", "false");
		$("filter-valor").update( label );
		$("op-".concat(id)).hide();
		$("op-".concat(this.option_selected['value'])).show();
		
		/***
		 * Seleciona objeto::
		 */
		 	this.option_selected['value'] = id;
			this.option_selected['label'] = label;
			
		/***
		 * Caso exista um callback em action ele é invocado::
		 */ 
		if( typeof this.options.action == 'function' )
		{
			this.options.action.call({label:label, value:id});
		}//if
	},
	close_options:function(e)
	{
		var el = Event.element(e)
			op = el.up(),
			ul = $$("#"+this.op.id+" > ul").first().id;
		
		if(el.hasClassName('form-options') == false && el.hasClassName('select-setinha') == false && $("arrow").readAttribute("open") == 'true')
		{
            $("arrow").setAttribute("open", "false");
			Effect.toggle(ul, 'blind', {duration:this.options.duration});
					
		}//if
			
	}
});