```js
init: function() {
    var src = '';
    var autoplay = '';
    var loop = '';
    var controls = '';
    var align = this.element.getStyle( 'text-align' );

    var width = '';
    var height = '';
    var poster = '';

    // If there's a child (the video element)
    if ( this.element.getChild( 0 ) ) {
        // get it's attributes.
        src = this.element.getChild( 0 ).getAttribute( 'src' );
        width = this.element.getChild( 0 ).getAttribute( 'width' );
        height = this.element.getChild( 0 ).getAttribute( 'height' );
        autoplay = this.element.getChild(0).getAttribute('autoplay');
        allowdownload = !this.element.getChild( 0 ).getAttribute( 'controlslist' );
        loop = this.element.getChild( 0 ).getAttribute( 'loop' );
        advisorytitle = this.element.getChild( 0 ).getAttribute( 'title' );
        controls = this.element.getChild(0).getAttribute('controls');
        responsive = this.element.getAttribute( 'data-responsive' );
        poster = this.element.getChild( 0 ).getAttribute( 'poster' );
    }

    if ( src ) {
        this.setData( 'src', src );

        if ( align ) {
            this.setData( 'align', align );
        } else {
            this.setData( 'align', 'none' );
        }

        if ( width ) {
            this.setData( 'width', width );
        }

        if ( height ) {
            this.setData( 'height', height );
        }

        if ( autoplay ) {
            this.setData( 'autoplay', 'yes' );
        }

        if ( allowdownload ) {
            this.setData( 'allowdownload', 'yes' );
        }

        if ( loop ) {
            this.setData( 'loop', 'yes' );
        }
                    
        if ( advisorytitle ) {
            this.setData( 'advisorytitle', advisorytitle );
        }

        if ( responsive ) {
            this.setData( 'responsive', responsive );    
        }

        if (controls) {
            this.setData('controls', controls);
        }

        if ( poster ) {
            this.setData('poster', poster);
        }
    }
}
```