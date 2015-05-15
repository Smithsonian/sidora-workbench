<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    >

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="SIdoraConcept">
        <html>
            <body>                
                <dl class="metadata-table"><xsl:apply-templates/></dl>
            </body>
        </html>
        
    </xsl:template>
    
    <xsl:template match="conceptType"> 
        <dt>Concept Type: <xsl:value-of select="current()"/></dt>
    </xsl:template>
    
    <xsl:template match="primaryTitle"> 
        <dt>Primary Title:</dt>
        <xsl:call-template name="formatTitle"/>
    </xsl:template>    
    
    <xsl:template match="altTitle">
        <xsl:if test="current()!=''">
            <dt><xsl:text>Alternate Title: </xsl:text>
            <xsl:if test="@type != ''">
                <xsl:value-of select="@type"/>:
            </xsl:if></dt>
            <xsl:call-template name="formatTitle"/>
        </xsl:if>        
    </xsl:template>

    <xsl:template match="identifier/value">
        <xsl:if test="current()!=''">
            <dt><xsl:text>Identifier: </xsl:text>
                <xsl:if test="@type != ''">
                    <xsl:value-of select="@type"/>:
                </xsl:if>
            </dt>
                <dd><xsl:value-of select="."/></dd>            
        </xsl:if>        
    </xsl:template>

    <xsl:template match="relationship">
        <xsl:if test="current()!=''">
            <dt><xsl:text>Relationship Type: </xsl:text>
                <xsl:value-of select="@type"/>
                
            </dt>
            <dd><xsl:text>Relationship Description: </xsl:text><xsl:value-of select="."/></dd>            
        </xsl:if>        
    </xsl:template>
    <xsl:template match="keyword">
        <xsl:if test="current()!='' and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Keyword'"/>
            </xsl:call-template>
        </xsl:if>        
    </xsl:template>
    
    <xsl:template match="Place">
        
        <dt><xsl:text>Place: </xsl:text>                
          <xsl:if test="@type != ''">
             <xsl:value-of select="@type"/>:
          </xsl:if>
        </dt>
        <xsl:call-template name="formatPlace"/> 
        <xsl:for-each select="note">
            <xsl:if test="current() != ''">
                <dd><xsl:text>Place Note: </xsl:text><xsl:value-of select="."/></dd>
            </xsl:if>
        </xsl:for-each>  
   
    </xsl:template>

    <xsl:template match="timePeriod"> 

        <xsl:call-template name="formatTime"/>    
 
    </xsl:template>    
    
    <xsl:template match="measurements">
        <xsl:if test="current()!=''">
            <dt>
                <xsl:text>Measurements: </xsl:text>
            </dt>
            <xsl:for-each select="measurementText">
                <xsl:if test="current()!=''">
                <dd><xsl:value-of select="."/></dd>
                </xsl:if>
            </xsl:for-each>            
            <xsl:for-each select="measurement">
                <dd>
                <xsl:if test="@type != ''">
                    <xsl:value-of select="@type"/>:
                </xsl:if>
                <xsl:value-of select="@value"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="@units"/>
                </dd>
            </xsl:for-each>
            <xsl:for-each select="timePeriod">
                    <xsl:call-template name="formatTime"/>
            </xsl:for-each>  

            <xsl:for-each select="accuracy/note">
                <xsl:if test="current() != ''">
                <dd><xsl:value-of select="."/></dd>
                </xsl:if>
            </xsl:for-each>  
            <xsl:for-each select="note">
                <xsl:if test="current() != ''">
                    <dd><xsl:text>Note: </xsl:text><xsl:value-of select="."/></dd>
                </xsl:if>
            </xsl:for-each>            
        </xsl:if>        
        
    </xsl:template>
    
    <xsl:template match="actor">
        <xsl:if test="current()!=''">
            <dt><xsl:text>Actor: </xsl:text>
                <xsl:if test="@role != ''">
                    <xsl:value-of select="@role"/>:
                </xsl:if></dt>
            <xsl:call-template name="formatActor"/>
        </xsl:if>               
    </xsl:template>    
    

    <xsl:template match="note">
        <xsl:if test="current()!=''">
            <dt>
                <xsl:text>Note: </xsl:text>
                <xsl:if test="@type != ''">
                    <xsl:value-of select="@type"/>:
                </xsl:if>
            </dt>
            <dd><xsl:value-of select="."/></dd>            
        </xsl:if>        
    </xsl:template>
    
    <xsl:template match="physDesc">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Physical Description'"/>
            </xsl:call-template>
        </xsl:if>        
    </xsl:template>
    

    <xsl:template match="condition">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Condition'"/>
            </xsl:call-template>
        </xsl:if>        
    </xsl:template>
    
    <xsl:template match="technique">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Technique'"/>
            </xsl:call-template>        </xsl:if>        
    </xsl:template>
    
    <xsl:template match="source">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Source'"/>
            </xsl:call-template>        </xsl:if>        
    </xsl:template>
    
    <xsl:template match="treatment">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Treatment'"/>
            </xsl:call-template>        </xsl:if>        
    </xsl:template>
    

    <xsl:template match="materials">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Materials'"/>
            </xsl:call-template>
        </xsl:if>        
    </xsl:template>
 
    <xsl:template match="style">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Style'"/>
            </xsl:call-template>
        </xsl:if>        
    </xsl:template>
 
    <xsl:template match="language">
        <xsl:if test="current()!=''  and (value !='' or note != '')">
            <xsl:call-template name="formatTypeValueNote">
                <xsl:with-param name="text" select="'Language'"/>
            </xsl:call-template>        </xsl:if>        
    </xsl:template>
    
    <xsl:template name="formatTypeValueNote">
        <xsl:param name="text"/>
        <dt><xsl:value-of select="$text"/><xsl:text>: </xsl:text>
        <xsl:if test="@type!=''">
             <xsl:value-of select="@type"/>:
        </xsl:if></dt>
        <xsl:for-each select="value">
             <xsl:if test="current() != ''">
                  <dd><xsl:value-of select="."/></dd>
             </xsl:if>
        </xsl:for-each>
        <xsl:for-each select="note">
             <xsl:if test="current() != ''">
                  <dd><xsl:text>Note: </xsl:text><xsl:value-of select="."/></dd>
             </xsl:if>
        </xsl:for-each>       
    </xsl:template>

    <xsl:template name="formatActor">
        <xsl:for-each select="persnameText">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>
        <xsl:for-each select="persname">
           <dd><xsl:call-template name="formatHumanName"/></dd>
        </xsl:for-each>
        <xsl:for-each select="taxonName">
            <dd><xsl:call-template name="formatTaxonName"/></dd>
        </xsl:for-each>
        <xsl:for-each select="corpname">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>       
    </xsl:template>
    

    <xsl:template name="formatTitle">
        <xsl:for-each select="titleText">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>
        <xsl:for-each select="persname">
            <xsl:if test="string-length(normalize-space(firstname)) or string-length(normalize-space(middlename)) or string-length(normalize-space(lastname))">            
                <dt><xsl:text>Full Name:  </xsl:text></dt>
            <dd><xsl:call-template name="formatHumanName"/></dd>
            </xsl:if>
        </xsl:for-each>
        <xsl:for-each select="taxonName">
            <xsl:call-template name="formatTaxonName"/>
        </xsl:for-each>
        <xsl:for-each select="corpname">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>        
    </xsl:template>
    
    <xsl:template name="formatPlace">
        <xsl:for-each select="geogname">
            <dt>
               <xsl:if test="@type!=''">
                   <xsl:value-of select="@type"/>:
               </xsl:if>
            </dt>
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>
        <xsl:for-each select="boundedby">
            
        </xsl:for-each>
        <xsl:for-each select="point">
            <dt>
                <xsl:if test="lat!=''">
                   <xsl:text>Latitude: </xsl:text> 
                </xsl:if>
            </dt>
            <dd><xsl:value-of select="lat"/></dd>
            <dt>
                <xsl:if test="long!=''">
                    <xsl:text>Longitude: </xsl:text> 
                </xsl:if>
            </dt>
            <dd><xsl:value-of select="long"/></dd>
        </xsl:for-each>
        <xsl:for-each select="geometry">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>  
        <xsl:for-each select="timePeriod">
            <xsl:call-template name="formatTime"></xsl:call-template>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template name="formatTime">           
        <xsl:if test="@type != ''">
                <dt><xsl:text>Time Period: </xsl:text>  
                <xsl:value-of select="@type"/>:</dt>
        </xsl:if>

        <xsl:for-each select="intervalName">
            <xsl:if test="current() != ''">
            <dd><xsl:value-of select="."/></dd>
            </xsl:if>
        </xsl:for-each>

        <xsl:for-each select="date">
            <dd>
                <xsl:if test="@type!=''">
                    <xsl:value-of select="@type"/>:
                </xsl:if>
                <xsl:if test="year!= ''">
                    <xsl:value-of select="year"/>               
                </xsl:if>
                <xsl:if test="month!= ''">
                    <xsl:text>-</xsl:text><xsl:value-of select="month"/>            
                </xsl:if>
                <xsl:if test="day!= ''">
                    <xsl:text>-</xsl:text><xsl:value-of select="day"/>         
                </xsl:if>  
                <xsl:if test="time!= ''">
                    <xsl:text>  Time:</xsl:text><xsl:value-of select="time"/>         
                </xsl:if>  
            </dd>
        </xsl:for-each>
        <xsl:for-each select="note">
            <xsl:if test="current() != ''">
                <dd><xsl:text>Time Period Note: </xsl:text><xsl:value-of select="."/></dd>
            </xsl:if> 
        </xsl:for-each>      
    </xsl:template>
    

    <xsl:template name="formatHumanName">
    
        <xsl:if test="lastname">
            <xsl:value-of select="lastname"/><xsl:text>, </xsl:text>            
        </xsl:if>
        <xsl:if test="firstname">
            <xsl:value-of select="firstname"/><xsl:text> </xsl:text>            
        </xsl:if>
        <xsl:if test="middlename">
            <xsl:value-of select="middlename"/><xsl:text> </xsl:text>            
        </xsl:if>
        <xsl:if test="suffix">
            <xsl:value-of select="suffix"/><xsl:text> </xsl:text>            
        </xsl:if>
    </xsl:template>
    
    <xsl:template name="formatTaxonName">
        <dd><xsl:text>Genus: </xsl:text><xsl:value-of select="genus"/></dd>
        <dd><xsl:text>Species: </xsl:text><xsl:value-of select="species"/></dd>
        <dd>
                <xsl:if test="commonName">
                    <xsl:text>Common Name: </xsl:text>
                    <xsl:for-each select="commonName">
                        <xsl:if test="current() != ''">
                            <xsl:text>- </xsl:text>
                            <xsl:value-of select="."/>

                        </xsl:if> 
                    </xsl:for-each>      
                </xsl:if>
         </dd>  
        <dd> 
            <xsl:if test="kingdom != ''">
            <xsl:text> Kingdom: </xsl:text>
            <xsl:value-of select="kingdom"/> 
        </xsl:if>
        </dd>
        <dd> 
            <xsl:if test="phylum != ''">
                <xsl:text>  Phylum: </xsl:text>
                <xsl:value-of select="phylum"/> 
            </xsl:if>
        </dd> 
        <dd> 
            <xsl:if test="class != ''">
                <xsl:text>   Class: </xsl:text>
                <xsl:value-of select="class"/> 
            </xsl:if>
        </dd>
        <dd> 
            <xsl:if test="order != ''">
                <xsl:text>    Order: </xsl:text>
                <xsl:value-of select="order"/> 
            </xsl:if>
        </dd>
        <dd> 
            <xsl:if test="family != ''">
                <xsl:text>     Family: </xsl:text>
                <xsl:value-of select="family"/> 
            </xsl:if>
        </dd>
         <dd>
               <xsl:for-each select="variant">
                   <xsl:if test="current() != ''">
                       <xsl:text>      Variant Type: </xsl:text><xsl:value-of select="@type"/>
                       <xsl:text> - </xsl:text>
                       <xsl:value-of select="."/>
                   </xsl:if> 
               </xsl:for-each>                    
          </dd>       
     
    </xsl:template>
    
    
</xsl:stylesheet>