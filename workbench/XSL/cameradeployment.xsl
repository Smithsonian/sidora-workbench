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
    <dt>Camera Site Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/othercit">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/origin">
    <xsl:if test="current()!=''">
    <dt>Originator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//citeinfo/pubdate">
          <xsl:if test="current()!=''">
              <dt>Publish Date</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//citeinfo/geoform">
    <xsl:if test="current()!=''">
    <dt>Format of Geospatial Data</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/abstract">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/supplinf">
    <xsl:if test="current()!=''">
    <dt>Purposed Lat and Long</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/lineage/procstep[procdesc='Proposed Camera Deployment Begin Date']/procdate">
    <xsl:if test="current()!=''">
    <dt>Proposed Camera Deployment Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/lineage/procstep[procdesc='Proposed Camera Deployment End Date']/procdate">
    <xsl:if test="current()!=''">
    <dt>Proposed Camera Deployment End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/begdate">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/enddate">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeperd/current">
        <xsl:if test="current()!=''">
            <dt>Currentness Reference</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//status/progress">
        <xsl:if test="current()!=''">
            <dt>Progress</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//status/update">
        <xsl:if test="current()!=''">
            <dt>Maintenance and Update Frequency</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/accconst">
          <xsl:if test="current()!=''">
              <dt>Access Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/useconst">
          <xsl:if test="current()!=''">
              <dt>Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>      
    <xsl:for-each select="//keywords">
        <xsl:for-each select="theme">        
            <xsl:for-each select="themekt">
                <xsl:if test="current()!=''">
                     <dt>Theme Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
            </xsl:for-each>
            <xsl:for-each select="themekey">
                <xsl:if test="current()!=''">
                    <dt>Theme Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
            </xsl:for-each>
        </xsl:for-each>
        <xsl:for-each select="place">
            <xsl:for-each select="placekt">
                 <xsl:if test="current()!=''">
                     <dt>Place Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                 </xsl:if>
             </xsl:for-each>
            <xsl:for-each select="placekey">
                <xsl:if test="current()!=''">
                    <dt>Place Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
            </xsl:for-each>
        </xsl:for-each>
    </xsl:for-each>
    <xsl:for-each select="//keywtax/taxonkey">
    <xsl:if test="current()!=''">
    <dt>Taxonomic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//taxoncl">
    <xsl:for-each select="taxonrn">
        <xsl:if test="current()!=''">
            <dt>Taxonomic Rank Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
        </xsl:for-each>
        <xsl:for-each select="taxonrv">
            <xsl:if test="current()!=''">
             <dt>Taxonomic Rank Value</dt><dd><xsl:value-of select="current()"/></dd>
            </xsl:if>
        </xsl:for-each>
        <xsl:for-each select="common">
            <xsl:if test="current()!=''">
                <dt>Common Name</dt><dd><xsl:value-of select="current()"/></dd>
            </xsl:if>
        </xsl:for-each>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/complete">
        <xsl:if test="current()!=''">
        <dt>Camera Failure Details</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='Bait']/methodid/methkey">
    <xsl:if test="current()!=''">
    <dt>Bait Type</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='Bait']/methdesc">
    <xsl:if test="current()!=''">
    <dt>Bait Methodology</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='Feature']/methodid/methkey">
    <xsl:if test="current()!=''">
    <dt>Feature</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='feature']/methodid/methdesc">
    <xsl:if test="current()!=''">
    <dt>Feature Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Camera ID']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Camera ID</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Image Resolution Setting']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Image Resolution Setting</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Detection Distance']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Detection Distance</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Sensitivity Setting']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Sensitivity Setting</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Quiet Period Setting']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Quiet Period Setting</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Camera Height']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Camera Height</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Habitat Type']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Habitat Type</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Proposed Latitude']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Proposed Latitude</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Proposed Longitude']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Proposed Longitude</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Actual Latitude']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Actual Latitude</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//detailed/attr[attrlabl='Actual Longitude']/attrdomv/edom/edomv">
          <xsl:if test="current()!=''">
              <dt>Actual Longitude</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/latres">
    <xsl:if test="current()!=''">
    <dt>Actual Latitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/longres">
    <xsl:if test="current()!=''">
    <dt>Actual Longitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdn">
    <xsl:if test="current()!=''">
    <dt>Metadata Standard Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdv">
    <xsl:if test="current()!=''">
    <dt>Metadata Standard Version</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>





  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
