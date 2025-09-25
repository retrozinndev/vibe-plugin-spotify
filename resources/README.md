# :package: Resources

Add your plugin's resources here, then add them to the list in the `resources.gresource.xml` file.

Example:
```xml
<?xml version="1.0" encoding="UTF-8"?>

<gresources>
    <gresource prefix="/your/resources/path/here">
        <!-- use the `<file>` tag to every single resource -->
        <file>resources/your_resource.ext</file>

        <!-- optionally, you can rename the resource(and also its extension!) -->
        <file alias="new-name-here.ext">resources/another_resource.ext</file>
    </gresource>
</gresources>
```

Also, on compile time, don't forget to add the `-g` flag, if you want to build the gresource too.
