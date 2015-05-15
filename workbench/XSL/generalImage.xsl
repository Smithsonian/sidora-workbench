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
      <xsl:for-each select="//mods:title">
          <xsl:if test="current()!=''">
              <dt>Title</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//mods:abstract">
    <xsl:if test="current()!=''">
    <dt>Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:subject/mods:topic">
    <xsl:if test="current()!=''">
    <dt>Topic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:subject/mods:geographic">
    <xsl:if test="current()!=''">
    <dt>Geographic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:name">
        <xsl:for-each select="mods:role/mods:roleTerm">
            <xsl:if test="current()!=''">
                <dt>Role</dt><dd><xsl:value-of select="current()"/></dd>
            </xsl:if>
        </xsl:for-each>
      <xsl:for-each select="mods:namePart">
        <xsl:if test="current()!=''">
        <dt>Name</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
      </xsl:for-each>
    </xsl:for-each>
 <xsl:for-each select="//mods:identifier">
    <xsl:if test="current()!=''">
    <dt>Identifier</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:genre">
    <xsl:if test="current()!=''">
    <dt>Genre</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:note[not(@*)]">
    <xsl:if test="current()!=''">
    <dt>Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:originInfo/mods:dateCaptured">
    <xsl:if test="current()!=''">
    <dt>Date Captured</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:physicalLocation">
    <xsl:if test="current()!=''">
    <dt>Physical Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:copyInformation/mods:subLocation">
    <xsl:if test="current()!=''">
    <dt>Sub Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 



  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
