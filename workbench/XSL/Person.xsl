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
    <xsl:for-each select="//cpf:nameEntry[@localType='primary']/cpf:part">
    <xsl:if test="current()!=''">
    <dt>Primary Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//cpf:nameEntry[@localType='abbreviation']/cpf:part">
          <xsl:if test="current()!=''">
              <dt>Name (Abbreviation)</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//cpf:nameEntry[@localType='alt']/cpf:part">
    <xsl:if test="current()!=''">
    <dt>Name (Alternative)</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//cpf:nameEntry/cpf:part[@localType='forename']">
          <xsl:if test="current()!=''">
              <dt>First Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:nameEntry/cpf:part[@localType='middle']">
          <xsl:if test="current()!=''">
              <dt>Middle Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:nameEntry/cpf:part[@localType='surname']">
          <xsl:if test="current()!=''">
              <dt>Last Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//cpf:existDates/cpf:dateRange/cpf:fromDate">
    <xsl:if test="current()!=''">
    <dt>From Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:existDates/cpf:dateRange/cpf:toDate">
    <xsl:if test="current()!=''">
    <dt>To Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='line1']">
    <xsl:if test="current()!=''">
    <dt>Address Line 1</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='line2']">
          <xsl:if test="current()!=''">
              <dt>Address Line 2</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='city']">
          <xsl:if test="current()!=''">
              <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='state']">
          <xsl:if test="current()!=''">
              <dt>State</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='postalcode']">
          <xsl:if test="current()!=''">
              <dt>Postal Code</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='country']">
          <xsl:if test="current()!=''">
              <dt>Country</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='url']">
          <xsl:if test="current()!=''">
              <dt>URL</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='phone']">
          <xsl:if test="current()!=''">
              <dt>Phone</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:place/cpf:address/cpf:addressLine[@localType='email']">
          <xsl:if test="current()!=''">
              <dt>Email</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    </xsl:for-each>
      <xsl:for-each select="//cpf:occupation/cpf:term">
          <xsl:if test="current()!=''">
              <dt>Occupation</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:biogHist/cpf:p">
          <xsl:if test="current()!=''">
              <dt>Biog History</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//cpf:languagesUsed/cpf:languageUsed">
          <xsl:if test="current()!=''">
              <dt>Language Code</dt><dd><xsl:value-of select="cpf:language/@languageCode"/></dd>
              <dt>Language</dt><dd><xsl:value-of select="cpf:language"/></dd>
              <dt>Script Code</dt><dd><xsl:value-of select="cpf:script/@scriptCode"/></dd>
              <dt>Script</dt><dd><xsl:value-of select="cpf:script"/></dd>
          </xsl:if>  
      </xsl:for-each>    
 


  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
