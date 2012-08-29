/***
 *	new Tabs("ul-id", {
 *          @Define caminho do arquivo:
 *				path:URL_IMG
 *			@Types do arquivo
 *				types:'.png'
 *			@Suffix do arquivo selecionado:
 *				suffix:'-select'
 *		});
 */
Tabs =  Class.create({
	ul:null,
	li_selected:null,

	options:{
		action:null,
		path:"",
		types:'.png',
		suffix:'-select'
	},

	initialize:function(ul, options)
	{
		Object.extend( this.options, options );

		this.ul = $(ul);
		
		$$('#' + this.ul.id + ' li').each(function (li) {
			 var suffix = new RegExp(this.classe.options.suffix),
				 cp_img = Element.clone( $(li).select("img").first() );
	
			/*** 
		     * Altera atributos::
			 */	
			 	src = ( ( $(cp_img).readAttribute('src').split("/").reverse()[0] ).split(".")[0] );
			 	cp_img.id = 'img-inativo';

			 	if( suffix.test( src ) )
			 		src = src.replace(suffix, "");
			 	else
			 	{
			 		cp_img.id = 'img-ativo';
			 		src = (src+this.classe.options.suffix);
			 	}//if

			 	$(cp_img)
			 		.hide()
			 		.setAttribute("src",
			 			this.classe.options.path+"/"+src+this.classe.options.types
			 		);

				$(li).select("img").first().insert({after:cp_img});

			li.observe('click', this.classe.sel.bind(this.classe) );
		}, {classe:this});

	},
	sel:function(e)
	{
		 var el = Event.element(e)
		 	 a = el.up()
		 	 li = a.up();
		try
		{
			if( !$(li).hasAttribute('content') )
				throw "click error.";

			$$('#' + this.ul.id + ' li').each(function( item ){
				var id = ( $(item).getAttribute("content") );
					
					$(id).hide();
					$(item).removeClassName("select");

					var id_img = ( "#%id a".replace("%id", item.id) );
					
					$$(id_img).first().select("#img-ativo")[0].hide();
					$$(id_img).first().select("#img-inativo")[0].show();
			});

			$(li).addClassName('select');
			$(a).select('#img-inativo').first().hide();
			$(a).select('#img-ativo').first().show();

			$( $(li).readAttribute('content') ).show();

			/***
			 * Caso exista alguma ação, ela é chamada quando ocorrer o click na aba::
			 */
				if( typeof this.options.action == 'function'){ this.options.action.call(li); }//function
		}
		catch(error){ /**/ }

	}
});
