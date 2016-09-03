+++
date = "2016-08-28T14:36:32-04:00"
draft = false
title = "Getting Ready for CakePHP 3"

+++
With the release of CakePHP 3.0.0 Development Preview 2, I decided to go over some of the PHP features that you can now take advantage of with confidence since CakePHP 3 requires PHP 5.4.3+.

## PHP 5.4<span class=\"muted\">.3</span>

### New Features

 * [Traits](#traits)
 * [Class Member Access on Instantiation](#classmemberaccessoninstantiation)
 * [Short Array Syntax](#shortarraysyntax)
 * [Short Echo](shortecho)

### Traits

Traits are probably one of the most technical features I will address in this post. If you get lost just remember; traits are just like copy & paste. 

If you're familiar with languages such as C++, Pearl, Python, or Scala then you're probably familiar with the concept of multiple inheritance and some of the problems that it can pose to a developer. I'm a dog person so let's take a look at the following psudo code that defines four very simple 'dog' classes:

    class Dog {
    	public function bark() {
        	echo 'woof';
        }
    }
    
    class BorderCollie extends Dog {
    }
    
    /**
     * The Basenji's nickname is the barkless 
     * dog.  YouTube it.
     */
    class Basenji extends Dog{
    	public function bark() {
        	echo 'baroo';
        }
    }
    
    /**
     * This isn't valid PHP and just serves as
     * a psudo code example of multiple
     * inheritance.
     * This class does not override bark()
     */
    class Mutt extends Basenji and extends BorderCollie {
    }

That all looks fine except when we try to do this:

    $Mutt = new Mutt;
    $Mutt->bark();

What does our `$Mutt` object echo? \"Woof\"? \"Baroo\"? The answer is we don't know. Both the `Basenji` and `BorderCollie` classes have a `bark()` method and thus our `Mutt` class must have a `bark()` method. The problem is that the call is ambiguous. PHP wouldn't know (if it supported multiple inheritance) which parent's method to call.

PHP is a single inheritance language and looks to use [traits](http://php.net/traits) to keep code <abbr title="Don't Repeat Yourself">DRY</abbr> by allowing a developer to reuse methods and properties across classes that may or may not be related.

#### What is a trait?

From the PHP docs:

> A Trait is similar to a class, but only intended to group functionality in a fine-grained and consistent way. It is not possible to instantiate a Trait on its own. It is an addition to traditional inheritance and enables horizontal composition of behavior; that is, the application of class members without requiring inheritance.<footer>From the PHP docs <cite title=\"http://php.net/traits\">php.net/traits</cite></footer>

#### Using Traits

So how do we use a trait? Simple, use the `use` keyword inside of a class definition:


    class Dog {
    	public function bark() {
        	echo 'woof';
        }
    }

    trait basenjiTrait {
        public function bark() {
            echo 'baroo';
        }
    }

    class Mutt extends Dog {
        use basenjiTrait;
    }

    $Mutt = new MyHelloWorld();
    $Mutt->bark();

    class Mutt extends BorderCollie {
    	use basenjiTrait;
    }

The `Mutt` class now has access to any methods and properties that `dogTrait` would have defined. 

#### Creating Traits

Creating traits is easy. It's just like creating a class. We begin with the keyword `trait` follow by the name we want to give our trait. Traits can't implement interfaces or extend classes or other traits. Remember traits are meant to solve the problem of code reuse in single inhertance lanuages.

#### Real World

(TODO Talk about CakePHP 3's use of the `Log Trait`)

### Class Member Access on Instantiation

A PHP developer can use Class Member Access on Instantiation when they need access to one or more of an objects methods or access to a single property and then no longer need the object or a reference to it.

Here's what we might do in < 5.4.0:
<pre><code class=\"php\">// Create the obejct and save in variable
$object = new Object;

// Use the new object to do something, saving the return value for use later. 
$result = $object->something();
    
//optionally remove the object from memory because we no longer need it.
unset($object);
</code></pre>

In 5.4.0+ we can simply do the following:

    $result = (new Object)->something();
    
The new object we created with `(new Object)` was not saved into a variable so there's nothing to unset.

### Short Array Syntax

instead of using the language construct `array()` each time you need an `array` data structure you can now use the short array syntax `[]`.

    // These are equivalent
    $a = array('apple', 'banana', 'pear');
    $b = ['apple', 'banana', 'pear'];
    
    // And so are these
    $a = array('one' => 1, 'two' => 2 'three' => 3)
    $b = ['one' => 1, 'two' => 2 'three' => 3];
    
    // Multidimentional arrays work as you would expect
    $milti = [
        ['Post' => 
            [
                'id' => 1,
                'title' => 'The title',
                'body' => 'This is the post body.'
            ]
        ],
        ['Post' =>
            [
                'id' => 2,
                'title' => 'A title once again',
                'body' => 'And the post body follows.'
            ]
        ],
        ['Post' =>
            [
                'id' => 3
                'title' => 'Title strikes back',
                'body' => 'This is really exciting! Not'
            ]
        ]
    ];
              

### Short Echo

PHP's short echo syntax is probably my favorite feature that becomes reliable in PHP 5.4 only because it makes PHP *feel* like a templating language.

The short echo should be used in **only** in view files (*.ctp) in place of `<?php echo`. It should be used to only print a single variable, array value, function, or method. The structure it outputs should be surrounded or either side by a single space, and closed with the php closing tag (`?>`). It should not contain a semicolon.

    // So something like:
    <?php echo $user['User']['name']; ?>
    
    // Becomes
    <?= $user['User']['name'] ?>
    
    // Functions are cool too
    <?= $this->Html->link('Dashboard', [
        'controller' => 'dashboards',
        'action' => 'index'
    ]) ?>

The most important part of the short echo tag is that is it no longer affected by the [`short_open_tag`](http://docs.php.net/manual/en/ini.core.php#ini.short-open-tag) directive.  As of PHP 5.4.0 `<?=` is **always** available.

https://github.com/cakephp/cakephp/pull/2596

#### Other Features added
* The typehint `callable`
* Sessions can track file [upload progress](http://docs.php.net/manual/en/session.upload-progress.php)
* \"Improved\" incompatible arguments warnings.
* Closures support `$this`

### Removed Features

## PHP 5.5<span class=\"muted\">.6</span>

<blockquote class=\"twitter-tweet\" lang=\"en\"><p><a href=\"https://twitter.com/search?q=%23PHP&amp;src=hash\">#PHP</a> 5.5.5 vs 5.5.6 <a href=\"https://twitter.com/search?q=%23performance&amp;src=hash\">#performance</a> difference at <a href=\"https://twitter.com/bownty\">@bownty</a> <a href=\"https://twitter.com/search?q=%23cakephp&amp;src=hash\">#cakephp</a> app - <a href=\"http://t.co/M1JOXRrzoG\">http://t.co/M1JOXRrzoG</a> (24h graph) no code changes - ~30ms faster &lt;3</p>&mdash; Christian Winther (@Jippi) <a href=\"https://twitter.com/Jippi/statuses/403110925860761601\">November 20, 2013</a></blockquote>
<script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>

Here's the code from the PHP source in question as it exists in the 5.5.5 tag:

    for (i = 0; i < argc; i++) {
		SEPARATE_ZVAL(args[i]);
		if (!replace) {
			php_array_merge(Z_ARRVAL_P(return_value), Z_ARRVAL_PP(args[i]), recursive TSRMLS_CC);
		} else if (recursive && i > 0) { /* First array will be copied directly instead */
			php_array_replace_recursive(Z_ARRVAL_P(return_value), Z_ARRVAL_PP(args[i]) TSRMLS_CC);
		} else {
			zend_hash_merge(Z_ARRVAL_P(return_value), Z_ARRVAL_PP(args[i]), (copy_ctor_func_t) zval_add_ref, NULL, sizeof(zval *), 1);
		}
	}
    
The line in question is the first line of the loop. PHP uses the `SEPARATE_ZVAL` macro internally for copy-on-write functionality. It creates a separate copy of a zval (a type of data container) if the container has multiple references. In the 5.5.6 tag it has simply been removed because the copying behavior does not serve a purpose. Many PHP frameworks, CakePHP included, use `array_merge()` and `func_get_args()`

http://www.php.net/ChangeLog-5.php#5.5.6
