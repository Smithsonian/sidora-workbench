<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:mods="http://www.loc.gov/mods/v3" 
xmlns:fits="http://hul.harvard.edu/ois/xml/ns/fits/fits_output" 
xmlns:cpf="urn:isbn:1-931666-33-4" 
xmlns:lido="http://www.lido-schema.org"
>

<xsl:template match="/">
  <html>
  <body>
  <dl class="metadata-table">
      <xsl:for-each select="xml_root/debug">
    <dt>Debug</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:for-each>
    <xsl:for-each select="//lido:objectWorkType/lido:term">
    <xsl:if test="current()!=''">
    <dt>Object Work Type</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//lido:classification/lido:term">
          <xsl:if test="current()!=''">
              <dt>Object Classification</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:titleSet/lido:appellationValue">
          <xsl:if test="current()!=''">
              <dt>Object Title</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:objectDescriptionSet[@lido:Type='General']">
          <xsl:if test="current()!=''">
              <dt>General Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:objectDescriptionSet[@lido:Type='context']">
          <xsl:if test="current()!=''">
              <dt>Context Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:objectDescriptionSet[@lido:Type='materials']">
          <xsl:if test="current()!=''">
              <dt>Materials Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:objectDescriptionSet[@lido:Type='ornament']">
          <xsl:if test="current()!=''">
              <dt>Ornament Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:objectDescriptionSet[@lido:Type='symbolism']">
          <xsl:if test="current()!=''">
              <dt>Symbolism Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:inscriptions">
          <xsl:if test="lido:inscriptionTranscription!=''">
              <dt>Inscription Transcription</dt>
              <dd><xsl:value-of select="lido:inscriptionTranscription"/></dd>
          </xsl:if>
          <xsl:if test="lido:inscriptionDescription/lido:descriptiveNoteValue!=''">
              <dt>Inscription Description</dt>
              <dd><xsl:value-of select="lido:inscriptionDescription/lido:descriptiveNoteValue"/></dd>
          </xsl:if>
      </xsl:for-each>           
      <xsl:for-each select="//lido:repositoryName/lido:legalBodyName/lido:appellationValue">
          <xsl:if test="current()!=''">
              <dt>Institute Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>  
      <xsl:for-each select="//lido:repositorySet/lido:workID">
          <xsl:if test="current()!=''">
              <dt>Institute ID</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:repositoryLocation/lido:placeID">
          <xsl:if test="current()!=''">
              <dt>Place ID</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:repositoryLocation/lido:namePlaceSet/lido:appellationValue">
          <xsl:if test="current()!=''">
              <dt>Place Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:displayObjectMeasurements">
          <xsl:if test="current()!=''">
              <dt>Display Object Measurements</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//lido:measurementsSet">
          <xsl:if test="lido:measurementType!=''">
              <dt>Measurement Type</dt>
              <dd><xsl:value-of select="lido:measurementType"/></dd>
          </xsl:if>
          <xsl:if test="lido:measurementUnit!=''">
              <dt>Measurement Unit</dt>
              <dd><xsl:value-of select="lido:measurementUnit"/></dd>
          </xsl:if>
          <xsl:if test="lido:measurementValue!=''">
              <dt>Measurement Value</dt>
              <dd><xsl:value-of select="lido:measurementValue"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//lido:eventSet">
          <xsl:if test="lido:event/lido:eventType/lido:term!=''">
              <dt>Event Type</dt>
              <dd><xsl:value-of select="lido:event/lido:eventType/lido:term"/></dd>
          </xsl:if>
              <xsl:for-each select="lido:event/lido:eventDate/lido:date">
              <xsl:if test="lido:earliestDate!=''">
                  <dt>Begin Date</dt>
                  <dd><xsl:value-of select="lido:earliestDate"/></dd>
              </xsl:if>
                  <xsl:if test="lido:latestDate!=''">
                      <dt>End Date</dt>
                      <dd><xsl:value-of select="lido:latestDate"/></dd>
                  </xsl:if>
              </xsl:for-each>
          <xsl:for-each select="lido:event/lido:eventPlace/lido:place">
              <xsl:if test="lido:placeID!=''">
                  <dt>Place ID</dt>
                  <dd><xsl:value-of select="lido:placeID"/></dd>
              </xsl:if>
              <xsl:if test="lido:namePlaceSet/lido:appellationValue!=''">
                  <dt>Place Name</dt>
                  <dd><xsl:value-of select="lido:namePlaceSet/lido:appellationValue"/></dd>
              </xsl:if>
              <xsl:if test="lido:namePlaceClassification/lido:term!=''">
                  <dt>Place Name</dt>
                  <dd><xsl:value-of select="lido:namePlaceClassification/lido:term"/></dd>
              </xsl:if>
          </xsl:for-each>
      </xsl:for-each> 


  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
