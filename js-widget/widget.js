
$.widget( "custom.progressbar", {
    options: {
      value: 0
    },
    _create: function() {
      const progress = `${this.options.value}%`;
      this.element
        .addClass( 'progressbar' )
        .text( progress );
    },

    // Create a public method.
    value: function( value ) {
      // No value passed, act as a getter.
      if ( value === undefined ) {
        return this.options.value;
      }

      // Value passed, act as a setter.
      this.options.value = this._constrain( value );
      var progress = `${this.options.value}%`;
      this.element.text( progress );
    },

    // Create a private method.
    _constrain: function( value ) {
      if ( value > 100 ) {
        value = 100;
      }
      if ( value < 0 ) {
        value = 0;
      }
      return value;
    }
});
