<?php
class SlideDeckLens_ToolKit extends SlideDeckLens_Scaffold {
	var $options_model = array(
        'Appearance' => array(
            'accentColor' => array(
                'value' => "#3ea0c1"
            ),
			'frame' => array(
				'name' => 'frame',
				'type' => 'select',
				'value' => 'frame',
				'values' => array(
                    'frame' => 'Thick',
					'hairline' => 'Hairline',
                    'none' => 'None',
				),
				'label' => 'Border/Frame',
				'description' => "Choose the thickness of the frame around your SlideDeck",
				'weight' => 40
			),
			'text-position' => array(
				'name' => 'text-position',
				'type' => 'select',
				'values' => array(
					'title-pos-top' => 'Top',
					'title-pos-bottom' => 'Bottom',
					'title-pos-left' => 'Left',
                    'title-pos-right' => 'Right',
                    'title-pos-fill' => 'Fill Slide'
                    				),
				'value' => 'title-pos-top',
				'label' => 'Caption Position',
				'description' => "Choose where to place the caption text on the slide",
				'weight' => 50
			),
			'text-color' => array(
				'name' => 'text-color',
				'type' => 'select',
				'values' => array(
					'title-dark' => 'Dark',
					'title-light' => 'Light'
				),
				'value' => 'title-dark',
				'label' => 'Text Color Variation',
				'weight' => 60
			),
            'hideSpines' => array(
                'type' => 'hidden',
                'value' => true
            )
        ),
		'Navigation' => array(
            'navigation-position' => array(
                'name' => 'navigation-position',
                'type' => 'radio',
                'attr' => array(
                    'class' => "fancy"
                ),
                'values' => array(
                    'nav-pos-top' => 'Top',
                    'nav-pos-bottom' => 'Bottom',
                    'nav-pos-left' => 'Left',
                    'nav-pos-right' => 'Right',
                ),
                'value' => 'nav-pos-bottom',
                'label' => 'Navigation Position',
                'description' => "Choose where the navigation panel resides",
                'weight' => 10
            ),
			'navigation-type' => array(
				'name' => 'navigation-type',
				'type' => 'select',
				'values' => array(
					'nav-dots' => 'Dots',
					'nav-thumb' => 'Thumbnails',
					'no-nav' => 'Turn Navigation Off'
				),
				'value' => 'nav-dots',
				'label' => 'Navigation Type',
				'description' => "Note: Dots Navigation Type is limited to a max of 10. If you have more than 10 slides, Thumbnails is better for your users.",
				'weight' => 20
			),
			'navigation-style' => array(
				'name' => 'navigation-style',
				'type' => 'select',
				'values' => array(
					'nav-default' => 'Inside slide area',
					'nav-bar' => 'In its own bar',
					'nav-hanging' => 'Hanging outside'
				),
				'value' => 'nav-default',
				'label' => 'Navigation Style',
				'description' => "Change the location of the SlideDeck's navigation elements. This may cause the caption position to be chnaged.",
				'weight' => 30
			),
			'arrow-style' => array(
				'name' => 'arrow-style',
				'type' => 'select',
				'values' => array(
					'arrowstyle-1' => 'Default',
					'arrowstyle-2' => 'Pointer Arrow',
					'arrowstyle-3' => 'Hairline Arrow',
					'arrowstyle-4' => 'Short Small Arrow',
					'arrowstyle-5' => 'Circle Hairline Button Arrow',
					'arrowstyle-6' => 'Circle Play Button Arrow',
					'arrowstyle-7' => 'Circle Pointer Button Arrow',
					'arrowstyle-8' => 'Circle Play Arrow',
					'arrowstyle-9' => 'Circle Pointer Arrow'
				),
				'value' => 'arrowstyle-7',
				'label' => 'Arrow Style',
				'description' => "Pick an arrow style that best matches your website's design.",
				'weight' => 40,
				'interface' => array(
				    'type' => 'thumbnails-flyout',
				    'values' => array(
				        'arrowstyle-1' => '/lenses/tool-kit/images/arrowstyle_1.thumb.png',
				        'arrowstyle-2' => '/lenses/tool-kit/images/arrowstyle_2.thumb.png',
				        'arrowstyle-3' => '/lenses/tool-kit/images/arrowstyle_3.thumb.png',
				        'arrowstyle-4' => '/lenses/tool-kit/images/arrowstyle_4.thumb.png',
				        'arrowstyle-5' => '/lenses/tool-kit/images/arrowstyle_5.thumb.png',
				        'arrowstyle-6' => '/lenses/tool-kit/images/arrowstyle_6.thumb.png',
				        'arrowstyle-7' => '/lenses/tool-kit/images/arrowstyle_7.thumb.png',
				        'arrowstyle-8' => '/lenses/tool-kit/images/arrowstyle_8.thumb.png',
				        'arrowstyle-9' => '/lenses/tool-kit/images/arrowstyle_9.thumb.png',
                    )
                )
			),
            'nav-arrow-style' => array(
                'name' => 'nav-arrow-style',
				'type' => 'select',
				'values' => array(
					'nav-arrow-style-1' => 'Button',
					'nav-arrow-style-2' => 'Arrow'
				),
				'value' => 'nav-arrow-style-1',
				'label' => 'Thumbnail Arrow Style',
				'weight' => 50,
				'description' => "Pick an arrow style for the Thumbnail Navigation"
			),
		)
    );
    
    function __construct(){
        parent::__construct();
        add_filter( "{$this->namespace}_get_slides", array( &$this, "slidedeck_get_slides" ), 11, 2 );
    }
    
    /**
     * Adding the accent-color class to the <a> tags if Twitter
     *
     * @param array $slides Array of Slides
     * @param array $slidedeck The SlideDeck object being rendered
     * 
     * @uses SlideDeckLens_Scaffold::is_valid()
     * 
     * @return array
     */
    function slidedeck_get_slides( $slides, $slidedeck ){
        if( $this->is_valid( $slidedeck['lens'] ) ){
            
            foreach( $slides as &$slide ){
                if( $slidedeck['source'] == 'twitter' ){
                    $slide['content'] = preg_replace( '/\<a /', '<a class="accent-color" ', $slide['content'] );
                }
            }
        }
        return $slides;
    }
    
    function slidedeck_render_slidedeck_before($html, $slidedeck){
		if( $this->is_valid( $slidedeck['lens'] ) ) {
			$html .= '<div class="sd-wrapper">';
		}
		return $html;
	}
	
	function slidedeck_render_slidedeck_after($html, $slidedeck){
		if( $this->is_valid( $slidedeck['lens'] ) ) {
			$html .= '</div>';
		}
		return $html;
	}
    
    /**
     * Add appropriate classes for this Lens to the SlideDeck frame
     * 
     * @param array $slidedeck_classes Classes to be applied
     * @param array $slidedeck The SlideDeck object being rendered
     * 
     * @return array
     */
    
    function slidedeck_frame_classes( $slidedeck_classes, $slidedeck ) {
        if( $this->is_valid( $slidedeck['lens'] ) ) {
        
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['navigation-type'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['frame'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['navigation-style'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['navigation-position'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['text-position'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['text-color'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['show-title'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['nav-arrow-style'];
	        $slidedeck_classes[] = $this->prefix . $slidedeck['options']['arrow-style'];
        }
        
        return $slidedeck_classes;
    }
    
    function slidedeck_dimensions( &$width, &$height, &$outer_width, &$outer_height, &$slidedeck ) {
    	global $SlideDeckPlugin;
    	if( $this->is_valid( $slidedeck['lens'] ) ) {
    			
    		$og_w = $width;
			$og_h = $height;
			$og_ow = $outer_width;
			$og_oh = $outer_height;
			
			$size = $SlideDeckPlugin->SlideDeck->get_closest_size($slidedeck);
    	
    		switch( $slidedeck['options']['frame'] ){
                case 'frame':
        			$width = $og_w - 24;
        			$height = $og_h - 24;
                    if( $slidedeck['options']['navigation-type'] != 'no-nav' ) {
            			if( $slidedeck['options']['navigation-style'] == 'nav-hanging' ) {
            				if( $slidedeck['options']['navigation-type'] == 'nav-thumb' ) {
        					    /**
                                 * This conditional handles the thumbnails when the nav
                                 * is hanging on the outside of the deck.
                                 */
                                switch( $size ){
                                    case 'large':
                                    case 'medium':
            							$height = $og_h - 94;
                                    break;
                                    case 'small':
            							$height = $og_h - 70;
                                    break;
                                }
                                
                                switch( $slidedeck['options']['navigation-position'] ){
                                    case 'nav-pos-left':
                                    case 'nav-pos-right':
                                        $height = $og_h - 24;
                                        $width = $og_w - 94;
                                    break;
                                }
        					}
        					if( $slidedeck['options']['navigation-type'] == 'nav-dots' ) {
        					    /**
                                 * This conditional handles the nav dots when the nav
                                 * is hanging on the outside of the deck.
                                 */
        					    switch( $size ){
                                    case 'large':
                                    case 'medium':
                                        $height = $og_h - 57;
                                    break;
                                    case 'small':
            							$height = $og_h - 47;
                                    break;
        					    }
                                
                                switch( $slidedeck['options']['navigation-position'] ){
                                    case 'nav-pos-top':
                                        $height = $og_h - 55;
                                    break;
                                    case 'nav-pos-left':
                                    case 'nav-pos-right':
                                        /**
                                         * If the dot nav is in its own bar or hanging
                                         * and the position is left or right, then we
                                         * need to make room at the edge for it.
                                         */
                                        $height = $og_h - 24;
                                        $width = $og_w - 54;
                                    break;
                                }
                                
            				}
            			}
            			if( $slidedeck['options']['navigation-style'] == 'nav-bar' ) {
            			    /**
                             * The following conditionals apply to the navigation in its own bar
                             */
            				if( $size == 'large' ) {
        						$height = $og_h - 66;
        					}
                            switch( $slidedeck['options']['navigation-position'] ){
                                case 'nav-pos-top':
                                    switch( $slidedeck['options']['navigation-type'] ){
                                        case 'nav-dots':
                		    				$height = $og_h - 44;
                                        break;
                                        case 'nav-thumb':
                                            $height = $og_h - 85;
                		    				if( $size == 'small' ) {
                		    					$height = $og_h - 68;
                		    				}
                                        break;
                                    }
                                break;
                                case 'nav-pos-bottom':
                                    switch( $slidedeck['options']['navigation-type'] ){
                                        case 'nav-dots':
                                            $height = $og_h - 46;
                                        break;
                                        case 'nav-thumb':
                                            $height = $og_h - 85;
                                            if( $size == 'small' ) {
                                                $height = $og_h - 68;
                                            }
                                        break;
                                    }
                                break;
                                case 'nav-pos-left':
                                case 'nav-pos-right':
                                    switch( $slidedeck['options']['navigation-type'] ){
                                        case 'nav-dots':
                                            /**
                                             * If the dot nav is in its own bar
                                             * and the position is left or right, then we
                                             * need to make room at the edge for it.
                                             */
                                            $width = $og_w - 46;
                                            $height = $og_h - 24;
                                        break;
                                        case 'nav-thumb':
                                            /**
                                             * For the thumbnail navigation on the left
                                             * or the right we'll maintain the $height and
                                             * adjust the $width accordingly.
                                             */
                                            $width = $og_w - 85;
                                            $height = $og_h - 24;
                                            if( $size == 'small' ) {
                                                $width = $og_w - 71;
                                            }
                                        break;
                                    }
                                break;
                            }
            			}
                    }
                break;
                case 'none':
                case 'hairline':
                    if( $slidedeck['options']['frame'] == 'hairline' ){
            			$width = $og_w - 2;
            			$height = $og_h - 2;
                    }
                    
                    switch( $slidedeck['options']['navigation-position'] ){
                        case 'nav-pos-left':
                        case 'nav-pos-right':
                            
                            switch( $slidedeck['options']['navigation-type'] ){
                                case 'nav-thumb':
                                    switch( $slidedeck['options']['navigation-style'] ){
                                        case 'nav-bar':
                                        case 'nav-hanging':
                                            switch( $size ){
                                                case 'large':
                                                case 'medium':
                                                    $width = $og_w - 73;
                                                break;
                                                case 'small':
                                                    $width = $og_w - 58;
                                                break;
                                            }
                                        break;
                                        case 'nav-default':
                                            switch( $size ){
                                                case 'large':
                                                case 'medium':
                                                    //$width = $og_w - 73;
                                                break;
                                                case 'small':
                                                    //$width = $og_w - 58;
                                                break;
                                            }
                                        break;
                                    }
                                break;
                                case 'nav-dots':
                                    if( in_array( $slidedeck['options']['navigation-style'], array('nav-bar', 'nav-hanging') ) ){
                                        /**
                                         * If the dot nav is in its own bar
                                         * and the position is left or right, then we
                                         * need to make room at the edge for it.
                                         */
                                         $width = $og_w - 32;
                                    }
                                break;
                            }
                            
                            
                            
                        break;
                        case 'nav-pos-top':
                        case 'nav-pos-bottom':
                            if( $slidedeck['options']['navigation-type'] != 'no-nav' ) {
                    			if( $slidedeck['options']['navigation-style'] == 'nav-bar' ) {
                    				if($slidedeck['options']['navigation-type'] == 'nav-dots'  ) {
                    				    if($slidedeck['options']['navigation-position'] == 'nav-pos-top'  ) {
                    	    				if( $size == 'small' || $size == 'medium' ){
                    	    					$height = $og_h - 2;
                                            }
                    	    				if( $size == 'large' ){
                    	    					$height = $og_h - 32;
                    	    				}
                                        }else{
                                            $height = $og_h - 34;
                                        }
                    				}
                    				if( $slidedeck['options']['navigation-type'] == 'nav-thumb'  ) {
                	    				if( $size == 'large' ) {
                	    					$height = $og_h - 71;
                    					}
                	    				if( $size == 'medium' ) {
                	    					$height = $og_h - 74;
                    					}
                    					if( $size == 'small' ){
                    						$height = $og_h - 60;
                    					}
                    				}
                    			}
                				if( $slidedeck['options']['navigation-style'] == 'nav-hanging' ) {
                					if( $slidedeck['options']['navigation-type'] == 'nav-thumb' ) {
                						if( $size == 'large' || $size == 'medium' ) {
                	    					$height = $og_h - 72;
                						}
                						if( $size == 'small' ){
                							$height = $og_h - 66;
                						}
                					}
                					if( $slidedeck['options']['navigation-type'] == 'nav-dots' ) {
                						if($slidedeck['options']['navigation-position'] == 'nav-pos-top'  ) {
                    						if( $size == 'large' || $size == 'medium' ) {
                    	    					$height = $og_h - 36;
                    						}
                    						if( $size == 'small' ){
                    							$height = $og_h - 54;
                                                $outer_height = $og_h - 26;
                    						}
                						}else{
                    						if( $size == 'large' || $size == 'medium' ) {
                    	    					$height = $og_h - 36;
                    						}
                    						if( $size == 'small' ){
                    							$height = $og_h - 34;
                    						}
                						}    
                					}
                				}
                            }
                        break;
                    }
                break;
    		}
    	}
    }

    /**
     * Making the SlideDeck process as a vertical deck
     * 
     * In this case, we'll only try to process the deck as vertical if
     * the navigation is on the right or left.
     * 
     * @param boolean $process_as_vertical default boolean - false
     * @param array $slidedeck The SlideDeck object being rendered
     * 
     * @uses SlideDeckLens_Scaffold::is_valid()
     * 
     * @return boolean
     */
    function slidedeck_process_as_vertical( $process_as_vertical, $slidedeck ){
        $vertical_navigation_positions = array( 'nav-pos-left', 'nav-pos-right' );
        if( $this->is_valid( $slidedeck['lens'] ) ) {
            if( in_array( $slidedeck['options']['navigation-position'], $vertical_navigation_positions ) ){
                $process_as_vertical = true;
            }
        }
        return $process_as_vertical;
    }
    
}
