# RB Parallax

Easy to apply parallax effect.

Can be created via JS or just with an HTML element

# Table of Contents
1. [With HTML Element](#element-parallax)
2. [With JS](#js-parallax)
3. [Settings](#parallax-settings)

### Parallax with HTML element. <a name="element-parallax"></a>

To automatically create a parallax effect from an HTML element, **add the class `rb-parallax` to it**.

``` html
<div class="rb-parallax">
	<img src="random/src.png"/>
</div>
```

This will wrap the element in a container of class `rb-parallax-container`, that fills the size of its container and has overflow hidden.

``` html
<div class="rb-parallax-container">
  <div class="rb-parallax">
      <img src="random/src.png"/>
  </div>
</div>
```

#### Set parallax settings through HTML element

When creating a parallax effect through an HTML element, the settings are passed through the attributes of the `.rb-parallax` that have the following format **`rb-parallax-${settingName}`**, where `${settingName}` is replaced with the name of the setting you wish to set.

In the next example, we are setting this options through attributes.

- velocity: 0.5
- mobile: true
- noWrap: false


``` html
<div class="rb-parallax" rb-parallax-velocity="0.5" rb-parallax-mobile="true" rb-parallax-noWrap="false">
	<img src="random/src.png"/>
</div>
```

## Parallax with JS <a name="js-parallax"></a>

To create a parallax effect with JS, you have to make use of the `RBParallaxCreator` object.

The `RBParallaxCreator` has a couple of methods. To create a new parallax element, use the `create` method as follows.

````
RBParallaxCreator.create($elem, settings)
````

| Argument | Type          | Required | Description                                                                                |
|----------|---------------|----------|--------------------------------------------------------------------------------------------|
| $elem    | jQuery Object | true     | jQuery object of the element to which the parallax effect should be applied                |
| settings | JSON          | false    | Settings to modify the behaviour of the parallax effect. If not passed, defaults are used. |


# Parallax Settings <a name="parallax-settings"></a>

| Setting | Type  | Default | Description                                                                                                             |
|--------------|-------|---------|-------------------------------------------------------------------------------------------------------------------------|
| velocity     | float | 0.5     | The velocity of the parallax effect. <br>1     => fixed <br>> 1   => Faster than scroll <br>< 1   => Slower than scroll |
| noWrap       | bool  | false   | Whether to wrap the parallax element in a container div of class `rb-parallax-container`                                |
| mobile       | bool  | true    | Indicates if the parallax effect should be applied in mobile.                                                           |
