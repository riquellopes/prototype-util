/***
 *  fp = new FacePage('/casamento/buscar',{
 *			pagination:{
 *				result_for_page:2,
 *				total:0
 *			}
 *		});
 * 
 *  fp.start({no:'henrique', na:'carol', dt:'2011-04-20'});
 */
FacePage = Class.create({
	url:'',
	filter:null,
	block:false,
	offset:0,
	limit:7,
	pages:0,

	options:{
		pagination:{
			result_for_page:7,
			total:0
		},
		
		class_name_elements:null,
		next_elements:null,
		first_param_get_href:false
	},

	initialize:function(url, options)
	{
		Object.extend( this.options, options );
		var _this = this;
				 
			 $H(this.options.pagination).each(function(n){
			 	this.options.pagination[n[0]] = parseInt( n[1] );
			 }, this);

		var pg = this.options.pagination;
			this.pages = Math.floor( pg.total / pg.result_for_page );

			this.offset = pg.result_for_page;
			this.url = ( url.replace(/\s+/g, '') );
			
		try
		{ 
			if( pg.total <= pg.result_for_page )
				throw 'No active pagination.';

			this._href_to_json();

			$(this.options.next_elements)
			.observe('click', this.next.bind(this))
			.setStyle({'display':pg.total > pg.result_for_page ? '': 'none'});
		}
		catch(error)
		{ 
			if( error.toLocaleLowerCase().replace(/\s|\./g, '') == 'noactivepagination' )
				$(this.options.next_elements).hide();

		}
	},

	start:function()
	{
		if( typeof arguments == 'object')
			this.filter = arguments||this.filter;
		this._ajax();
	},

	next:function()
	{
		try
		{
			$('face-page-result-search-'.concat(this.offset)).show();
			this.offset = (this.offset + this.options.pagination.result_for_page);

			this._next();
		}catch(error){ /**/ }
	},

	_href_to_json:function()
	{
		if( !this.options.first_param_get_href )
			return ;

		var href = ( window.location.search.replace('?', '').split('&') ),
			_this = this;

			if( href.length )
			{
				this.filter = {};
				href.each(function(item){
					var it = item.split('=');
						_this.filter[it[0]] = decodeURIComponent(it[1]);
				});

				this._next();
			}//if

	},

	_next:function()
	{
		this.filter = Object.extend( this.filter, {offset:this.offset} );
		this._ajax();
	},

	_last_element:function()
	{
		try
		{
			var pos = (this.offset - this.options.pagination.result_for_page);
				$('face-page-result-search-'.concat(pos)).hasChildNodes();
				return $('face-page-result-search-'.concat(pos));

		}catch(error){ return $$('.'.concat(this.options.class_name_elements)).last(); }
	},

	_create_element:function(rs)
	{
		try
		{
			var offset = this.offset,
				item = this._last_element();
					   $(item).insert({
					   		after:
						   		new Element('span', {id:'face-page-result-search-'.concat(offset)})
						   			.setStyle({display:'none'})
					   	});

					    $('face-page-result-search-'.concat(offset)).innerHTML = rs;

		}catch(error){ /**/ }
	},

	_ajax:function()
	{
		var _this = this;
			
			if( this.block )
			{
				$(this.options.next_elements).remove();
				return ;
			}
				

		new Ajax.Request(_this.url, {
			method:'get',
 			parameters:_this.filter,
 			onSuccess:function(rs)
 			{
 				var json = (rs.responseJSON);

 					_this._create_element(json.template);
 					_this.block = Boolean((_this.offset + _this.options.pagination.result_for_page) > _this.options.pagination.total);
 					
 			}
		});
	}
});