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
      <xsl:for-each select="//mods:subTitle">
          <xsl:if test="current()!=''">
              <dt>Sub-Title</dt><dd><xsl:value-of select="current()"/></dd>
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
      <xsl:for-each select="//mods:typeOfResource">
          <xsl:if test="current()!=''">
              <dt>Type of Resource</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:genre">
          <xsl:if test="current()!=''">
              <dt>Genre</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:originInfo/mods:dateIssued">
          <xsl:if test="current()!=''">
              <dt>Date Issued</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:originInfo/mods:publisher">
          <xsl:if test="current()!=''">
              <dt>Publisher</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:originInfo/mods:place/mods:placeTerm[@authority='marccountry']">
          <xsl:if test="current()!=''">
              <dt>Country</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:originInfo/mods:place/mods:placeTerm[@type='text']">
          <xsl:if test="current()!=''">
              <dt>Place</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:language/mods:languageTerm[@type='code']">
          <xsl:if test="current()!=''">
              <dt>Language</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each> 
      <xsl:for-each select="//mods:abstract">
          <xsl:if test="current()!=''">
              <dt>Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>   
      <xsl:for-each select="//mods:identifier">
          <xsl:if test="current()!=''">
              <dt>Identifier</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>     
      <xsl:for-each select="//mods:physicalDescription/mods:form">
          <xsl:if test="current()!=''">
              <dt>Form</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:physicalDescription/mods:extent">
          <xsl:if test="current()!=''">
              <dt>Extent</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//mods:note">
          <xsl:if test="current()!=''">
              <dt>Note</dt><dd><xsl:value-of select="current()"/></dd>
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
      <xsl:for-each select="//mods:subject/mods:temporal">
          <xsl:if test="current()!=''">
              <dt>Temporal Keyword</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:continent">
    <xsl:if test="current()!=''">
    <dt>Continent</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:country">
    <xsl:if test="current()!=''">
    <dt>Country</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:province">
    <xsl:if test="current()!=''">
    <dt>State or Province</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:region">
    <xsl:if test="current()!=''">
    <dt>Region</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:county">
    <xsl:if test="current()!=''">
    <dt>County</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:city">
    <xsl:if test="current()!=''">
    <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:citySection">
    <xsl:if test="current()!=''">
    <dt>City Section</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:cartographics/mods:coordinates">
    <xsl:if test="current()!=''">
    <dt>Coordinates</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 


  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
