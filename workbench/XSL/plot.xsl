<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:mods="http://www.loc.gov/mods/v3" 
xmlns:fits="http://hul.harvard.edu/ois/xml/ns/fits/fits_output" 
xmlns:cpf="urn:isbn:1-931666-33-4" 
>

<xsl:template match="/">
  <html>
  <body>
  <dl class="metadata-table">
      <xsl:for-each select="xml_root/debug">
    <dt>Debug</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:for-each>
    <xsl:for-each select="//citeinfo/title">
    <xsl:if test="current()!=''">
    <dt>Plot Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each> 
    <xsl:for-each select="//descript/supplinf">
    <xsl:if test="current()!=''">
    <dt>Plot Notes</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
       <xsl:for-each select="//method/methdesc">
              <xsl:if test="current()!=''">
                  <dt>Plot Treatment</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
 


  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
